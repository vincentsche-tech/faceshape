"""SEO title / desc length audit for faceshapeai.app.

Hits every public page and reports:
- T_len (Google typically truncates titles after ~60 chars)
- D_len (Google typically truncates descriptions after ~160 chars)
- Flag: 'OK' / 'T[XX]' / 'D[XX]' if over limit

Usage:
    python scripts/audit_seo.py

Acceptance rule (from DEPLOY-CHECKLIST.md section 1.5):
- Title INPUT ≤ 46 chars (renders ≤ 60 after brand suffix)
- Description ≤ 160 chars

Run this BEFORE pushing metadata changes. Any T[XX]/D[XX] flag = fail.
"""
import urllib.request, re

PATHS = [
    '/', '/eye-shape', '/nose-shape',
    '/color-analysis', '/body-shape', '/tools',
    '/face-shapes/oval', '/face-shapes/round', '/face-shapes/square',
    '/face-shapes/heart', '/face-shapes/oblong', '/face-shapes/diamond',
    '/face-shapes/triangle',
    '/vs',
]

T_LIMIT = 60
D_LIMIT = 160

print(f"{'PATH':<35} {'T':>4} {'D':>5} {'FLAG':<14} CONTENT")
print('-' * 120)
fail_count = 0
for p in PATHS:
    url = 'https://www.faceshapeai.app' + p
    try:
        html = urllib.request.urlopen(url, timeout=20).read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f'{p:<35} ERR  {e}')
        fail_count += 1
        continue
    m_t = re.search(r'<title>([^<]*)</title>', html)
    m_d = re.search(r'<meta name="description" content="([^"]*)"', html)
    title = m_t.group(1) if m_t else ''
    desc = m_d.group(1) if m_d else ''
    t_len = len(title)
    d_len = len(desc)
    flag = []
    if t_len > T_LIMIT: flag.append(f'T[{t_len}]'); fail_count += 1
    if d_len > D_LIMIT: flag.append(f'D[{d_len}]'); fail_count += 1
    if not flag: flag = ['OK']
    preview = title[:60] + ('...' if len(title) > 60 else '')
    print(f'{p:<35} {t_len:>4} {d_len:>5} {",".join(flag):<14} | {preview}')

print('-' * 120)
print(f'TOTAL: {len(PATHS)} pages, {fail_count} failing flag(s).')
print('Standard: Title ≤ 60, Description ≤ 160.')
print('Hint: layout.tsx brand suffix "%s · FaceShape AI" adds 14 chars — design inputs at ≤ 46.')
