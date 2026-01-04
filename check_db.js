
const Database = require('better-sqlite3');
const db = new Database('edugen.db');

const chapters = db.prepare('SELECT * FROM chapters').all();
console.log('--- Chapters ---');
chapters.forEach(c => {
    console.log(`ID: ${c.id}, ChapterId: ${c.chapterId}, Name: ${c.name}, VideoId: ${c.video_id}`);
});

const courses = db.prepare('SELECT * FROM courses').all();
console.log('\n--- Courses ---');
courses.forEach(c => {
    console.log(`ID: ${c.id}, CourseId: ${c.course_id}, Name: ${c.name}`);
});
