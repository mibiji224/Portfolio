// Brand logos for the Skills pills, served from /public/logos. Colours are the
// tools' own: most are the official SVG marks (Iconify's `logos` set, devicon
// and Simple Icons recoloured to the brand hex); Procreate, ibisPaint and
// CapCut have no SVG in those sets, so they use the app icon from the
// vendor's own site (PNG). A tool with no entry (REST API is a style, not a
// product) renders its pill without a logo.
const file = (name) => `/logos/${name}`

export const TOOL_LOGOS = {
  'HTML': file('html.svg'),
  'CSS': file('css.svg'),
  'Tailwind CSS': file('tailwind.svg'),
  'Bootstrap': file('bootstrap.svg'),
  'React': file('react.svg'),
  'JavaScript': file('javascript.svg'),
  'Python': file('python.svg'),
  'PHP': file('php.svg'),
  'Java': file('java.svg'),
  'Node.js': file('nodejs.svg'),
  'MySQL': file('mysql.svg'),
  'MongoDB': file('mongodb.svg'),
  'Firebase': file('firebase.svg'),
  'PostgreSQL': file('postgresql.svg'),
  'Git': file('git.svg'),
  'GitHub': file('github.svg'),
  'VSCode': file('vscode.svg'),
  'Eclipse': file('eclipse.svg'),
  'NetBeans': file('netbeans.svg'),
  'Xampp': file('xampp.svg'),
  'Figma': file('figma.svg'),
  'Adobe Photoshop': file('photoshop.svg'),
  'Canva': file('canva.svg'),
  'Blender': file('blender.svg'),
  'Procreate': file('procreate.png'),
  'IbisPaint': file('ibispaint.png'),
  'CapCut': file('capcut.png'),
  'Photopea': file('photopea.svg'),
  'Google Suite': file('gsuite.svg'),
  'Excel': file('excel.svg'),
  'Word': file('word.svg'),
  'Google Sheets': file('sheets.svg'),
  'Google Docs': file('docs.svg'),
  'Notion': file('notion.svg'),
  'Slack': file('slack.svg'),
  'Trello': file('trello.svg'),
  'Zoom': file('zoom.svg'),
  'GMeet': file('gmeet.svg'),
  'Outlook': file('outlook.svg'),
  'Loom': file('loom.svg'),
}
