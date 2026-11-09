import pathlib

here = pathlib.Path('/home/claude/portfolio')
scratch = pathlib.Path('/tmp/claude-0/-home-claude/1de67e9b-c990-579c-9708-43edb1e96584/scratchpad')
photo = (scratch / 'cvimg' / 'photo.b64').read_text().strip()

css = (here / 'style.css').read_text()
body = (here / 'body.html').read_text().replace('__PHOTO__', photo)
js = (here / 'app.js').read_text()

fonts = ('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800'
         '&family=IBM+Plex+Mono:wght@400;500&family=Instrument+Sans:wght@400..600&display=swap')

deliver = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Md. Masud Rana | Civil Engineer</title>
<meta name="description" content="Portfolio of Md. Masud Rana, civil engineer from Sirajganj, Bangladesh. Site supervision, piling and foundation works, BOQ and AutoCAD.">
<meta name="theme-color" content="#0a111b">
<meta property="og:title" content="Md. Masud Rana | Civil Engineer">
<meta property="og:description" content="Site supervision, piling and foundation works, BOQ and AutoCAD.">
<meta property="og:type" content="website">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="{fonts}">
<style>
{css}
</style>
</head>
<body>
{body}
<script>
{js}
</script>
</body>
</html>
'''

preview = f'''<title>Md. Masud Rana</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="{fonts}">
<style>
{css}
</style>
{body}
<script>
{js}
</script>
'''

(here / 'index.html').write_text(deliver)
(here / 'preview.html').write_text(preview)
print(len(deliver), len(preview))
