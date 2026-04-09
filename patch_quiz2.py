#!/usr/bin/env python3
"""Complete quiz button insertion for Class 03 sections 1-10."""

with open('/home/falcon/Apps/code/80M-ui/src/PortalPage.jsx', 'r') as f:
    lines = f.readlines()

# Class 03 sections (1-indexed) with their 0-indexed closing line numbers
# From analysis: 1→325, 2→1295, 3→1333, 4→1355, 5→1377, 6→1407, 7→1429, 8→1502, 9→1535, 10→1614
section_closes = {1:325, 2:1295, 3:1333, 4:1355, 5:1377, 6:1407, 7:1429, 8:1502, 9:1535, 10:1614}

quiz_btn = '''
          <div className="mt-8 mb-4 text-center">
            <button
              onClick={() => { setQuizActive(true); setQuizSection(SN); }}
              className="font-sans font-black text-lg uppercase px-8 py-4 bg-[#111] text-[#eae7de] border-[3px] border-[#111] hover:bg-[#22c55e] hover:text-[#111] shadow-[6px_6px_0_0_#111] transition-colors cursor-pointer"
            >
              Take Quiz — Section SN
            </button>
          </div>
'''

inserted = 0
for snum in sorted(section_closes.keys(), reverse=True):
    close_idx = section_closes[snum]
    closing = lines[close_idx].rstrip()
    # Insert before the closing </div> (8-space indent)
    btn = quiz_btn.replace('SN', str(snum))
    lines[close_idx] = closing + btn + '\n'
    print("Inserted button for Section %d at line %d" % (snum, close_idx+1))
    inserted += 1

print("\nInserted %d buttons. Writing file..." % inserted)

with open('/home/falcon/Apps/code/80M-ui/src/PortalPage.jsx', 'w') as f:
    f.writelines(lines)

print("Done. Total lines:", len(lines))
