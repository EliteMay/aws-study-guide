import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];

const requiredFiles = [
  'index.html',
  '404.html',
  'css/styles.css',
  'js/app.js',
  'data/manifest.json',
  'data/aws-core.json',
  'README.md',
  'REQUIREMENTS.md',
  'SPEC.md',
  'PROJECT_LEARNINGS.md',
  'WORK_REPORT.md'
];

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) failures.push(`Missing required file: ${file}`);
}

const readJson = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const manifest = readJson('data/manifest.json');
const data = readJson('data/aws-core.json');

if (manifest.schemaVersion !== 1) failures.push('manifest schemaVersion must be 1');
if (data.schemaVersion !== 1) failures.push('dataset schemaVersion must be 1');
if (!Array.isArray(data.topics) || !Array.isArray(data.quiz) || !Array.isArray(data.roadmap)) failures.push('dataset arrays are missing');

const topicIds = new Set();
for (const topic of data.topics ?? []) {
  if (!topic.id) failures.push('topic without id');
  else if (topicIds.has(topic.id)) failures.push(`duplicate topic id: ${topic.id}`);
  else topicIds.add(topic.id);

  for (const field of ['title','service','category','summary','mentalModel','compare','examTip','sourceUrl']) {
    if (!topic[field]) failures.push(`topic ${topic.id ?? '?'} missing ${field}`);
  }
  if (!Array.isArray(topic.keyPoints) || topic.keyPoints.length < 2) failures.push(`topic ${topic.id ?? '?'} has insufficient keyPoints`);
}

if (manifest.counts?.topics !== data.topics?.length) failures.push('manifest topic count mismatch');
if (manifest.counts?.quizQuestions !== data.quiz?.length) failures.push('manifest quiz count mismatch');

const quizIds = new Set();
for (const question of data.quiz ?? []) {
  if (!question.id || quizIds.has(question.id)) failures.push(`invalid or duplicate quiz id: ${question.id}`);
  quizIds.add(question.id);
  if (!topicIds.has(question.topicId)) failures.push(`quiz ${question.id} references missing topic ${question.topicId}`);
  if (!Array.isArray(question.choices) || question.choices.length < 2) failures.push(`quiz ${question.id} has invalid choices`);
  if (!Number.isInteger(question.answer) || question.answer < 0 || question.answer >= question.choices.length) failures.push(`quiz ${question.id} has invalid answer`);
}

for (const step of data.roadmap ?? []) {
  for (const id of step.topicIds ?? []) {
    if (!topicIds.has(id)) failures.push(`roadmap step ${step.step} references missing topic ${id}`);
  }
}

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const localRefs = [...html.matchAll(/(?:href|src)="(\.\/[^"#?]+)"/g)].map(match => match[1].replace(/^\.\//, ''));
for (const ref of localRefs) {
  if (!fs.existsSync(path.join(root, ref))) failures.push(`Broken local reference in index.html: ${ref}`);
}

for (const file of ['index.html','js/app.js','data/manifest.json','data/aws-core.json']) {
  const content = fs.readFileSync(path.join(root, file), 'utf8');
  const suspicious = [
    /AKIA[0-9A-Z]{16}/,
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
    /aws_secret_access_key\s*[:=]/i
  ];
  if (suspicious.some(pattern => pattern.test(content))) failures.push(`Possible secret material in ${file}`);
}

if (failures.length) {
  console.error('AWS Study Guide validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Validation passed: ${data.topics.length} topics, ${data.quiz.length} quiz questions.`);
