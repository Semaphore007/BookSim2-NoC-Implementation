const MANUAL_FILE_ID = '12KcAQ8A6q4ta_Nwh9v-WM4zJueScywSv'

export const links = {
  projectGithub: 'https://github.com/Semaphore007/BookSim2-NoC-Implementation',
  booksimGithub: 'https://github.com/booksim/booksim2',
  booksimManual: 'https://github.com/booksim/booksim2/blob/master/doc/manual.tex',
  booksimWebsite: 'https://nocs.stanford.edu/booksim.html',
  manualPdf: `https://drive.google.com/file/d/${MANUAL_FILE_ID}/view?usp=sharing`,
  manualPdfDownload: `https://drive.google.com/uc?export=download&id=${MANUAL_FILE_ID}`,
  onlineGdb: 'https://www.onlinegdb.com/',
  codespaces: 'https://github.com/features/codespaces',
  authorGithub: 'https://github.com/Semaphore007',
  linkedin: 'https://www.linkedin.com/in/siddharth-gautam-883539238/',
  telegram: 'https://t.me/TheOutlier_2003',
} as const

export const navItems = [
  { href: '/', label: 'Home' },
  { href: '/overview', label: 'Overview' },
  { href: '/setup', label: 'Setup' },
  { href: '/implementation', label: 'Implementation' },
  { href: '/simulation', label: 'Simulation' },
  { href: '/results', label: 'Results' },
  { href: '/resources', label: 'Resources' },
  { href: '/manual', label: 'Manual' },
  { href: '/contact', label: 'Contact' },
] as const
