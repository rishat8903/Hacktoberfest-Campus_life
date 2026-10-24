import { StudyNoteResult } from '../types/campus';

export const SAMPLE_CSE_STUDY_NOTE: StudyNoteResult = {
  id: 'sample-cse-dbms-3nf',
  topicTitle: 'Database Normalization: 1NF, 2NF & 3NF Rules',
  courseCode: 'CSE-3501 (Database Management Systems)',
  summaryBn: 'ডাটাবেস নরমালাইজেশন হলো ডাটাবেসের টেবিলগুলোকে এমনভাবে সাজানো যাতে কোনো অপ্রয়োজনীয় ডাটা বারবার জমা না হয় (Redundancy কমানো) এবং ডাটা ইনসার্ট, ডিলিট বা আপডেটের সময় কোনো গোলমাল (Anomaly) তৈরি না হয়। ৩য় নরমাল ফর্ম (3NF)-এ থাকতে হলে টেবিলে ২য় নরমাল ফর্মের নিয়ম মানার পাশাপাশি কোনো ট্রানজিটিভ ডিপেনডেন্সি (Transitive Dependency) থাকতে পারবে না (অর্থাৎ নন-প্রাইম অ্যাট্রিবিউট অন্য কোনো নন-প্রাইম অ্যাট্রিবিউটের ওপর নির্ভর করতে পারবে না)।',
  summaryEn: 'Database Normalization is the systematic approach of decomposing tables to eliminate data redundancy and insertion/update/deletion anomalies. A relation is in 3NF if it satisfies 2NF and has no transitive functional dependencies (i.e., no non-prime attribute depends on another non-prime attribute).',
  keyConcepts: [
    '1NF: Attributes must contain atomic (indivisible) values with unique column names.',
    '2NF: Must be in 1NF and have NO partial dependency on any candidate key subset.',
    '3NF: Must be in 2NF and have NO transitive dependencies (X -> Y, Y -> Z).',
    'BCNF (Boyce-Codd NF): Strict 3NF where for every dependency X -> Y, X must be a super key.',
  ],
  quiz: [
    {
      id: 'q1',
      question: 'Which normal form eliminates partial dependency on a composite primary key?',
      options: ['1st Normal Form (1NF)', '2nd Normal Form (2NF)', '3rd Normal Form (3NF)', 'BCNF'],
      correctAnswerIndex: 1,
      explanation: '2NF specifically eliminates partial functional dependencies, requiring all non-prime attributes to be fully functionally dependent on the primary key.',
    },
    {
      id: 'q2',
      question: 'If A -> B and B -> C exist in a table where A is the primary key, this is known as:',
      options: ['Multivalued Dependency', 'Partial Dependency', 'Transitive Dependency', 'Trivial Dependency'],
      correctAnswerIndex: 2,
      explanation: 'A dependency of a non-key attribute on another non-key attribute via the primary key is called a Transitive Dependency, which is prohibited in 3NF.',
    },
    {
      id: 'q3',
      question: 'In a student table, storing multiple phone numbers comma-separated in a single attribute violates which normal form?',
      options: ['1st Normal Form (1NF - Requires Atomic Values)', '2nd Normal Form (2NF - Partial Dependency)', '3rd Normal Form (3NF - Transitive Dependency)', 'Boyce-Codd NF (BCNF)'],
      correctAnswerIndex: 0,
      explanation: '1NF strictly requires that every column contains atomic (single, indivisible) values. Storing multiple comma-separated values in a single cell directly violates 1NF.',
    },
  ],
};

/**
 * Returns a high-resolution handwritten-style SVG notebook graphic
 * of CSE-3501 Database Normalization lecture notes.
 * Uses valid XML entities and base64 encoding for universal browser compatibility.
 */
export function getSampleLectureNoteSvg(): string {
  const lines = [
    { y: 170, text: '• Core Problem: Data Redundancy causes Anomaly (Insert, Update, Delete)!' },
    { y: 220, text: '1. First Normal Form (1NF):' },
    { y: 270, text: '   -> All attributes must be ATOMIC values (No repeating groups or arrays).' },
    { y: 320, text: '   -> e.g. Phone = {01711, 01812} is NOT allowed in 1NF! Split to individual rows.' },
    { y: 380, text: '2. Second Normal Form (2NF):' },
    { y: 430, text: '   -> Must satisfy 1NF first.' },
    { y: 480, text: '   -> NO Partial Dependency! (Non-prime attributes must fully depend on PK).' },
    { y: 530, text: '   -> If PK = (StudentID, CourseID), Grade depends on both. Valid 2NF.' },
    { y: 590, text: '3. Third Normal Form (3NF):' },
    { y: 640, text: '   -> Must satisfy 2NF.' },
    { y: 690, text: '   -> NO Transitive Dependency! (X -> Y and Y -> Z where Y is not a superkey).' },
    { y: 740, text: '   -> StudentID -> DeptID and DeptID -> DeptName === VIOLATES 3NF!' },
    { y: 800, text: '• Solution: Decompose into 2 tables: (StudentID, DeptID) and (DeptID, DeptName).' },
    { y: 860, text: '• BCNF (Boyce-Codd): For every dependency X -> Y, X MUST be a Super Key.' },
    { y: 920, text: 'Important for Midterm Exam! Review textbook Chapter 7 and Past Questions.' },
  ];

  const escapeXml = (str: string) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

  const svgLinesHtml = lines
    .map(
      (item) => `
    <line x1="20" y1="${item.y + 10}" x2="780" y2="${item.y + 10}" stroke="#e2e8f0" stroke-width="1.2"/>
    <text x="160" y="${item.y}" font-size="15" fill="#1e293b" font-weight="500">${escapeXml(item.text)}</text>`
    )
    .join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1050" width="100%" height="100%" style="background:#fcfbf7; font-family:'Fira Code', 'Courier New', monospace;">
  <defs>
    <filter id="page-shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="2" dy="4" stdDeviation="4" flood-color="#8c7853" flood-opacity="0.2"/>
    </filter>
  </defs>

  <!-- Page base -->
  <rect x="20" y="20" width="760" height="1010" rx="10" fill="#fffefb" stroke="#e2d8c9" stroke-width="2" filter="url(#page-shadow)"/>

  <!-- Red Margins -->
  <line x1="140" y1="20" x2="140" y2="1030" stroke="#f87171" stroke-width="2" opacity="0.75"/>
  <line x1="20" y1="120" x2="780" y2="120" stroke="#f87171" stroke-width="2" opacity="0.75"/>

  <!-- Top Note Header -->
  <text x="160" y="75" font-size="19" font-weight="700" fill="#0f172a">IIUC &bull; Dept of CSE &bull; Semester 5</text>
  <text x="160" y="105" font-size="13" font-weight="600" fill="#2563eb">Course: CSE-3501 (DBMS) | Topic: Normalization (1NF &rarr; 3NF)</text>
  <text x="680" y="75" font-size="12" font-weight="600" fill="#64748b">Date: 24/10</text>

  <!-- Ruled notebook lines & handwritten concepts -->
  ${svgLinesHtml}

  <!-- Watermark Stamp -->
  <g transform="translate(600, 940) rotate(-10)" opacity="0.45">
    <rect x="-10" y="-10" width="140" height="44" rx="6" fill="none" stroke="#10b981" stroke-width="2.5"/>
    <text x="60" y="18" text-anchor="middle" font-size="13" font-weight="800" fill="#10b981">IIUC CSE NOTES</text>
  </g>
</svg>`;

  try {
    if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
      return `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(svg)))}`;
    }
    if (typeof Buffer !== 'undefined') {
      return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
    }
  } catch (err) {
    console.error('Base64 encoding error:', err);
  }

  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}
