#!/usr/bin/env python3
"""Patch PortalPage.jsx to add quiz buttons to Class 03 sections."""

with open('/home/falcon/Apps/code/80M-ui/src/PortalPage.jsx', 'r') as f:
    content = f.read()

# Section div patterns (section_comment -> mb-24 div line)
# We need to add id="sec-N" to each section's mb-24 div
sections = [
    (921, 954, 9),   # Section 9: Dictionary (starts line 921, mb-24 at 954)
    (954, 990, 10),  # Section 10: ResourceLocker
    (1163, 1202, 1), # Section 1: DNS
    (1223, 1260, 2), # Section 2: Nginx
    (1289, 1318, 3), # Section 3: Defense
    (1327, 1328, 4), # Section 4: SSL
    (1349, 1350, 5), # Section 5: Tunnel
    (1371, 1372, 6), # Section 6: Monitoring
    (1401, 1420, 7), # Section 7: Scaling
    (1423, 1460, 8), # Section 8: Firewall
]

quiz_btn = '''
          <div className="mt-8 mb-4 text-center">
            <button
              onClick={() => { setQuizActive(true); setQuizSection(SN); }}
              className="font-sans font-black text-lg uppercase px-8 py-4 bg-[#111] text-[#eae7de] border-[3px] border-[#111] hover:bg-[#22c55e] hover:text-[#111] shadow-[6px_6px_0_0_#111] transition-colors cursor-pointer"
            >
              Take Quiz — Section SN
            </button>
          </div>
        </div>
'''

quiz_btn_no_close = '''
          <div className="mt-8 mb-4 text-center">
            <button
              onClick={() => { setQuizActive(true); setQuizSection(SN); }}
              className="font-sans font-black text-lg uppercase px-8 py-4 bg-[#111] text-[#eae7de] border-[3px] border-[#111] hover:bg-[#22c55e] hover:text-[#111] shadow-[6px_6px_0_0_#111] transition-colors cursor-pointer"
            >
              Take Quiz — Section SN
            </button>
          </div>
'''

# For each section, find the closing </div> of the mb-24 wrapper
# We use line-by-line approach

lines = content.split('\n')
print("File has %d lines" % len(lines))

# Find the exact closing line for each section's mb-24 div
# by finding the mb-24 div then tracking depth

def find_section_close(lines, mb24_line, section_num):
    """Find the closing </div> of a mb-24 div starting at mb24_line."""
    depth = 0
    for i in range(mb24_line, len(lines)):
        line = lines[i]
        opens = line.count('<div') + line.count('<motion.div')
        closes = line.count('</div>') + line.count('</motion.div')
        depth += opens - closes
        if depth < 0:
            return i
        if depth == 0 and i > mb24_line:
            # Check if next meaningful content is a new section
            next_content = '\n'.join(lines[i+1:i+3])
            if 'mb-24' in next_content or '/* Section' in next_content:
                return i
    return -1

# Find mb-24 divs and their closes
section_closes = {}
for i, line in enumerate(lines):
    if '<div className="mb-24">' in line:
        # Check lines above for section comment
        for j in range(i-1, max(0, i-5), -1):
            import re
            m = re.search(r'Section\s+(\d+)', lines[j])
            if m:
                snum = int(m.group(1))
                close_line = find_section_close(lines, i, snum)
                if close_line > 0:
                    section_closes[snum] = close_line
                    print("Section %d: mb-24 at %d, closes at %d" % (snum, i+1, close_line+1))
                break

print("\nAll section closes:", section_closes)

# Now insert quiz buttons before each closing </div>
# Work in reverse order (bottom of file first) to preserve line numbers
for snum in sorted(section_closes.keys(), reverse=True):
    close_line = section_closes[snum]
    # Verify this is a closing </div> at 8-space indent
    closing = lines[close_line].rstrip()
    print("Section %d: closing line %d: %r" % (snum, close_line+1, closing[:60]))
