# Re-run after editing Settings/Explorer/Music: python3 build-inline.py
# Embeds the apps so they work when index.html is opened straight from disk (file://)
import json
apps=['script/Apps/Settings/index.html','script/Apps/Explorer/index.html','script/Apps/Explorer/classic.html','script/Apps/Music/index.html','script/Apps/Store/index.html','script/Apps/Browser/index.html','script/Apps/YouTube/index.html','script/Apps/Customize/index.html','script/Apps/Messages/index.html']
open('inline-apps.js','w').write('window._INLINE_APPS='+json.dumps({a:open(a,encoding='utf8').read() for a in apps})+';')
