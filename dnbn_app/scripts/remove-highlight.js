const fs = require("fs");
const path = require("path");

// HTML 파일들이 있는 디렉토리
const assignmentDir = path.join(__dirname, "../assets/assignment");

// 모든 HTML 파일 찾기
const htmlFiles = fs
  .readdirSync(assignmentDir)
  .filter((file) => file.endsWith(".html"));

console.log(`총 ${htmlFiles.length}개의 HTML 파일을 처리합니다.\n`);

htmlFiles.forEach((filename) => {
  const filePath = path.join(assignmentDir, filename);

  try {
    // HTML 파일 읽기
    let content = fs.readFileSync(filePath, "utf-8");

    // <mark> 태그 카운트
    const markCount = (content.match(/<mark>/g) || []).length;

    if (markCount > 0) {
      // <mark> 와 </mark> 태그 제거
      content = content.replace(/<mark>/g, "");
      content = content.replace(/<\/mark>/g, "");

      // 파일 저장
      fs.writeFileSync(filePath, content, "utf-8");
      console.log(`✓ ${filename}: ${markCount}개의 <mark> 태그 제거 완료`);
    } else {
      console.log(`- ${filename}: 강조 표시 없음`);
    }
  } catch (error) {
    console.error(`✗ ${filename} 처리 실패:`, error.message);
  }
});

console.log("\n모든 HTML 파일 처리 완료!");
