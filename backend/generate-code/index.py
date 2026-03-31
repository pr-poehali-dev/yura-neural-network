"""Генерация кода через Hugging Face Inference API по описанию пользователя"""
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
    """Генерация кода для веб-фреймворков через Hugging Face"""
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

    api_key = os.environ.get('HF_API_KEY', '')
    if not api_key:
        return {'statusCode': 500, 'headers': cors, 'body': json.dumps({'error': 'HF API key not configured'})}

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
        'model': 'Qwen/Qwen2.5-Coder-32B-Instruct',
        'messages': [
            {'role': 'system', 'content': SYSTEM_PROMPT},
            {'role': 'user', 'content': user_message}
        ],
        'temperature': 0.3,
        'max_tokens': 4000
    }).encode('utf-8')

    req = urllib.request.Request(
        'https://router.huggingface.co/v1/chat/completions',
        data=payload,
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {api_key}'
        }
    )

    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            result = json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8') if e.fp else ''
        return {
            'statusCode': 502,
            'headers': cors,
            'body': json.dumps({'error': f'HF API error: {e.code}', 'details': error_body})
        }
    except Exception as e:
        return {
            'statusCode': 502,
            'headers': cors,
            'body': json.dumps({'error': f'Request failed: {str(e)}'})
        }

    code = result.get('choices', [{}])[0].get('message', {}).get('content', '')

    if code.startswith('```'):
        lines = code.split('\n')
        lines = lines[1:]
        if lines and lines[-1].strip() == '```':
            lines = lines[:-1]
        code = '\n'.join(lines)

    usage = result.get('usage', {})

    return {
        'statusCode': 200,
        'headers': cors,
        'body': json.dumps({
            'code': code,
            'framework': framework,
            'tokens': usage.get('total_tokens', 0)
        })
    }
