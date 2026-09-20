import pathlib, re, json
p = pathlib.Path(r"D:\czar III\TRABALHO . CLIENTES\Fernand aprisco\Fernando-Quincas\dist\blog\aprisco-didatico-intercambio-alemanha-escola-waldorf-fazenda-adolphshof-bauru-ava\index.html")
html = p.read_text(encoding='utf-8')
title = re.search(r'<title>(.*?)</title>', html, re.S).group(1)
desc = re.search(r'<meta name="description" content="(.*?)"', html).group(1)
canon = re.search(r'<link rel="canonical" href="(.*?)"', html).group(1)
ogimg = re.search(r'<meta property="og:image" content="(.*?)"', html).group(1)
print('TITLE:', title)
print('DESC:', desc[:220])
print('CANON:', canon)
print('OGIMG:', ogimg)
lds = re.findall(r'<script type="application/ld\+json"[^>]*>(.*?)</script>', html, re.S)
print('JSONLD count:', len(lds))
for i, ld in enumerate(lds):
    try:
        obj=json.loads(ld)
        print(f'LD {i}:', obj.get('@type'))
        if obj.get('@type')=='BlogPosting':
            print('  headline:', obj.get('headline','')[:80])
            print('  keywords:', obj.get('keywords','')[:150])
            imgs = obj.get('image', [])
            print('  image count:', len(imgs))
            print('  first image:', imgs[0][:80] if imgs else 'none')
            print('  articleSection:', obj.get('articleSection'))
        if obj.get('@type')=='BreadcrumbList':
            print('  breadcrumb items:', len(obj.get('itemListElement', [])))
    except Exception as e:
        print('parse fail', e)
print('contains webp?', '/blog/intercambio-alemanha' in html)
# sitemap check
smap = pathlib.Path(r"D:\czar III\TRABALHO . CLIENTES\Fernand aprisco\Fernando-Quincas\public\sitemap.xml").read_text(encoding='utf-8')
print('sitemap contains slug?', 'aprisco-didatico-intercambio-alemanha' in smap)
print('sitemap image entries for new post:', smap.count('aprisco-didatico'))
