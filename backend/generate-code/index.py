"""Генерация кода через Google Gemini по описанию пользователя"""
import json
import os
import urllib.request
import urllib.error


SYSTEM_PROMPT = """Ты — экспертный генератор кода. Пользователь описывает что нужно создать, а ты пишешь готовый, рабочий код.

Правила:
- Пиши только код, без пояснений до или после
- Код должен быть production-ready, чистый и читаемый
- Используй TypeScript для React/Next.js/Angular, JavaScript для Vanilla JS, Vue SFC для Vue, Svelte для Svelte
- Добавляй типизацию где это уместно
- Используй современные подходы и паттерны фреймворка
- Стили пиши через Tailwind CSS
- Не добавляй комментарии в код, если пользователь не просит
- Отвечай ТОЛЬКО кодом — никакого текста, markdown-обёрток или тройных обратных кавычек"""


def handler(event, context):
    """Генерация кода для веб-фреймворков через Google Gemini"""
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token, X-Session-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    cors = {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}

    if event.get('httpMethod') != 'POST':
        return {'statusCode': 405, 'headers': cors, 'body': json.dumps({'error': 'Method not allowed'})}

    body = json.loads(event.get('body', '{}'))
    prompt = body.get('prompt', '').strip()
    framework = body.get('framework', 'react')
    code_type = body.get('codeType', 'Компонент')

    if not prompt:
        return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'Prompt is required'})}

    api_key = os.environ.get('GEMINI_API_KEY', '')
    if not api_key:
        return {'statusCode': 500, 'headers': cors, 'body': json.dumps({'error': 'Gemini API key not configured'})}

    framework_map = {
        'react': 'React с TypeScript и Tailwind CSS',
        'vue': 'Vue 3 Composition API (SFC формат) с Tailwind CSS',
        'angular': 'Angular с TypeScript',
        'svelte': 'Svelte с TypeScript',
        'nextjs': 'Next.js 14 App Router с TypeScript и Tailwind CSS',
        'vanilla': 'Vanilla JavaScript (ES6+) с HTML и CSS',
    }

    framework_name = framework_map.get(framework, 'React с TypeScript')
    user_message = f"Фреймворк: {framework_name}\nТип: {code_type}\nЗадача: {prompt}"

    payload = json.dumps({
        'contents': [
            {
                'parts': [
                    {'text': SYSTEM_PROMPT + '\n\n' + user_message}
                ]
            }
        ],
        'generationConfig': {
            'temperature': 0.3,
            'maxOutputTokens': 4000
        }
    }).encode('utf-8')

    url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}'

    req = urllib.request.Request(
        url,
        data=payload,
        headers={'Content-Type': 'application/json'}
    )

    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            result = json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8') if e.fp else ''
        return {
            'statusCode': 502,
            'headers': cors,
            'body': json.dumps({'error': f'Gemini API error: {e.code}', 'details': error_body})
        }
    except Exception as e:
        return {
            'statusCode': 502,
            'headers': cors,
            'body': json.dumps({'error': f'Request failed: {str(e)}'})
        }

    candidates = result.get('candidates', [])
    if not candidates:
        return {'statusCode': 502, 'headers': cors, 'body': json.dumps({'error': 'No response from Gemini'})}

    parts = candidates[0].get('content', {}).get('parts', [])
    code = parts[0].get('text', '') if parts else ''

    if code.startswith('```'):
        lines = code.split('\n')
        lines = lines[1:]
        if lines and lines[-1].strip() == '```':
            lines = lines[:-1]
        code = '\n'.join(lines)

    usage = result.get('usageMetadata', {})
    total_tokens = usage.get('totalTokenCount', 0)

    return {
        'statusCode': 200,
        'headers': cors,
        'body': json.dumps({
            'code': code,
            'framework': framework,
            'tokens': total_tokens
        })
    }
