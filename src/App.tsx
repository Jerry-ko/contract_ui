import { useState } from "react";
import { Button, Flex, message, Upload, type UploadFile } from "antd";
import "./App.css";

const MAX_COUNT = 5;
const TOTAL_MAX_MB = 20;

function App() {
  const [fileList, setFileList] = useState<UploadFile<any>[]>([]);

  return (
    <Flex vertical gap={20}>
      {/* 파일 업로드 영역 */}
      <section>
        <Flex vertical gap={8} align="center">
          <span>계약서를 업로드하세요</span>
          <span>(PDF / 이미지)</span>
          <Upload
            multiple
            accept=".pdf,image/*"
            action="/api/analyze"
            maxCount={MAX_COUNT}
            fileList={fileList}
            onChange={({ fileList: next }) => setFileList(next)}
            beforeUpload={(file) => {
              // 타입 체크
              const okType =
                file.type === "application/pdf" ||
                file.type.startsWith("image/");
              if (!okType) {
                message.error("PDF 또는 이미지 파일만 업로드할 수 있어요.");
                return Upload.LIST_IGNORE;
              }

              // ✅ 총 용량만 체크
              const currentTotal = fileList.reduce(
                (sum, f) => sum + (f.size || 0),
                0,
              );

              const nextTotalMB = (currentTotal + file.size) / 1024 / 1024;

              if (nextTotalMB > TOTAL_MAX_MB) {
                message.error(
                  `전체 업로드 용량은 ${TOTAL_MAX_MB}MB를 넘을 수 없어요.`,
                );
                return Upload.LIST_IGNORE;
              }

              return true;
            }}
          >
            <Button>
              파일 선택 (최대 {MAX_COUNT}개, 총 {TOTAL_MAX_MB}MB)
            </Button>
          </Upload>
        </Flex>
      </section>

      <section>[분석 결과 요약]</section>
      <section>[위험 조항별 카드]</section>
      <section>[한계 명시]</section>
    </Flex>
  );
}

export default App;
