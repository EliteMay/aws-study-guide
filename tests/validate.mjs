import fs from 'node:fs';
import path from 'node:path';

const failures = [];
const required = [
  'index.html','404.html','css/base.css','css/views.css','js/app.js','js/views.js',
  'data/manifest.json','data/course-core.json','data/lessons-foundation.json','data/lessons-core-services.json','data/lessons-advanced.json',
  'README.md','REQUIREMENTS.md','SPEC.md','PROJECT_LEARNINGS.md','WORK_REPORT.md'
];
for (const file of required) if (!fs.existsSync(file)) failures.push(`missing ${file}`);
const read = file => JSON.parse(fs.readFileSync(file,'utf8'));
const manifest = read('data/manifest.json');
const core = read('data/course-core.json');
const lessonDocs = ['data/lessons-foundation.json','data/lessons-core-services.json','data/lessons-advanced.json'].map(read);
const data = {...core, lessons: lessonDocs.flatMap(x => x.lessons ?? [])};
if (manifest.schemaVersion !== 2) failures.push('manifest schemaVersion must be 2');
if (!Array.isArray(data.chapters) || data.chapters.length < 8) failures.push('chapters too small');
if (!Array.isArray(data.lessons) || data.lessons.length < 20) failures.push('lessons too small');
if (!Array.isArray(data.comparisons) || data.comparisons.length < 4) failures.push('comparisons too small');
if (!Array.isArray(data.scenarios) || data.scenarios.length < 4) failures.push('scenarios too small');
if (!Array.isArray(data.glossary) || data.glossary.length < 12) failures.push('glossary too small');
const chapterIds = new Set(data.chapters.map(x => x.id));
const lessonIds = new Set();
for (const lesson of data.lessons ?? []) {
  if (!lesson.id || lessonIds.has(lesson.id)) failures.push(`duplicate lesson ${lesson.id}`);
  lessonIds.add(lesson.id);
  if (!chapterIds.has(lesson.chapter)) failures.push(`bad chapter ${lesson.id}`);
  for (const key of ['title','lead','analogy','connect','source']) if (!lesson[key]) failures.push(`${lesson.id} missing ${key}`);
  if (!Array.isArray(lesson.points) || lesson.points.length < 3) failures.push(`${lesson.id} insufficient points`);
  if (!Array.isArray(lesson.flow) || lesson.flow.length < 2) failures.push(`${lesson.id} insufficient flow`);
  if (!Array.isArray(lesson.terms) || lesson.terms.length < 2) failures.push(`${lesson.id} insufficient terms`);
  if (!lesson.check || !Array.isArray(lesson.check.choices) || !Number.isInteger(lesson.check.answer) || lesson.check.answer < 0 || lesson.check.answer >= lesson.check.choices.length) failures.push(`${lesson.id} invalid check`);
  if (!/^https:\/\//.test(lesson.source)) failures.push(`${lesson.id} invalid source URL`);
}
const counts = manifest.counts ?? {};
for (const [key,value] of Object.entries({chapters:data.chapters.length,lessons:data.lessons.length,comparisons:data.comparisons.length,scenarios:data.scenarios.length,glossaryTerms:data.glossary.length})) if (counts[key] !== value) failures.push(`manifest ${key} mismatch`);
for (const file of manifest.files ?? []) if (!fs.existsSync(file.replace(/^\.\//,''))) failures.push(`manifest missing file ${file}`);
const html = fs.readFileSync('index.html','utf8');
for (const ref of [...html.matchAll(/(?:href|src)="(\.\/[^"#?]+)"/g)].map(m=>m[1].slice(2))) if (!fs.existsSync(path.join(process.cwd(),ref))) failures.push(`broken local ref ${ref}`);
for (const ref of ['./css/base.css','./css/views.css','./js/app.js','./js/views.js']) if (!html.includes(ref)) failures.push(`index missing ${ref}`);
const runtime = fs.readFileSync('js/app.js','utf8') + fs.readFileSync('js/views.js','utf8');
if (!runtime.includes('awsStudyGuide.progress.v1')) failures.push('storage compatibility key missing');
for (const file of manifest.files) if (!runtime.includes(file)) failures.push(`runtime does not load ${file}`);
if (runtime.includes('DecompressionStream') || runtime.includes('.json.gz')) failures.push('temporary compressed runtime path remains');
for (const file of ['index.html','js/app.js','js/views.js',...manifest.files.map(x=>x.replace(/^\.\//,''))]) {
  const content = fs.readFileSync(file,'utf8');
  const suspicious = [/AKIA[0-9A-Z]{16}/,/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,/aws_secret_access_key\s*[:=]/i];
  if (suspicious.some(p=>p.test(content))) failures.push(`possible secret material in ${file}`);
}
if (failures.length) { console.error('AWS Study Guide validation failed:'); for (const failure of failures) console.error(`- ${failure}`); process.exit(1); }
console.log(`Validation passed: ${data.chapters.length} chapters, ${data.lessons.length} lessons, ${data.comparisons.length} comparisons, ${data.scenarios.length} scenarios, ${data.glossary.length} glossary terms.`);
