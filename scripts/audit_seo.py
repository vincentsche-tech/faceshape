"""SEO title / desc length audit for faceshapeai.app.

Reads every URL from the live sitemap.xml (so new pages are covered
automatically), then reports each page's <title> and meta description
length against Google limits:
  - title  rendered <= 60  (input <= 46 because layout adds ' · FaceShape AI')
  - desc   <= 160

Run:  python scripts/audit_seo.py
"""
import urllib.request
import re
import xml.etree.ElementTree as ET

NS = '{http://www.sitemaps.org/schemas/sitemap/0.9}'
SITEMAP = 'https://www.faceshapeai.app/sitemap.xml'

try:
    raw = urllib.request.urlopen(SITEMAP, timeout=25).read()
    urls = [u.text for u in ET.fromstring(raw).iter(f'{NS}loc')]
except Exception as e:
    print(f'sitemap fetch failed: {e}')
    urls = []

fail_count = 0
print(f"{'URL (path)':<45} {'T':<4} {'D':<5} {'FLAG':<12} TITLE")
print('-' * 135)
for url in urls:
    path = url.replace('https://www.faceshapeai.app', '')
    try:
        html = urllib.request.urlopen(url, timeout=25).read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f'{path:<45} ERR  {e}')
        fail_count += 1
        continue
    m_t = re.search(r'<title>([^<]*)</title>', html)
    m_d = re.search(r'<meta name="description" content="([^"]*)"', html)
    title = m_t.group(1) if m_t else ''
    desc = m_d.group(1) if m_d else ''
    t_len, d_len = len(title), len(desc)
    flag = []
    if t_len > 60:
        flag.append(f'T[{t_len}]')
        fail_count += 1
    if d_len > 160:
        flag.append(f'D[{d_len}]')
        fail_count += 1
    if not flag:
        flag = ['OK']
    shown = title[:58] + ('…' if len(title) > 58 else '')
    print(f'{path:<45} {t_len:<4} {d_len:<5} {",".join(flag):<12} | {shown}')

print('-' * 135)
print(f'TOTAL: {len(urls)} pages, {fail_count} failing flag(s).')
print('Standard: Title ≤ 60, Description ≤ 160.')
print('Hint: layout.tsx brand suffix " · FaceShape AI" adds 14 chars — design inputs at ≤ 46.')
