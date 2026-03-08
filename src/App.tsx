import { useState } from "react";
import { Button, Flex, message, Upload, type UploadFile } from "antd";
import "./App.css";

const MAX_COUNT = 5;
const FILE_MAX_MB = 10;
const TOTAL_MAX_MB = 20;

function App() {
  const [fileList, setFileList] = useState<UploadFile<any>[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleClickAnalyze = async () => {
    if (isAnalyzing) return;

    if (fileList.length === 0) {
      message.warning("분석할 파일을 먼저 업로드해주세요.");
      return;
    }

    const files = fileList
      .map((f) => f.originFileObj)
      .filter(Boolean) as File[];

    if (files.length === 0) {
      message.error("업로드된 파일을 다시 선택해주세요.");
      return;
    }

    const formData = new FormData();

    files.forEach((file) => formData.append("files", file));

    try {
      setIsAnalyzing(true);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg = data.message || "분석 중 오류가 발생했어요";
        message.error(msg);
        return;
      }

      message.success("분석이 완료됐어요!");
      console.log("analyze result:", data.result);
    } catch (e) {
      message.error("분석 중 오류가 발생했어요.");
    } finally {
      setIsAnalyzing(false);
    }
  };
  return (
    <Flex vertical gap={20}>
      {/* 파일 업로드 영역 */}
      <section>
        <Flex vertical gap={8} align="center">
          <span>계약서를 사진으로 찍어 업로드하세요.</span>
          <span>(JPG, PNG)</span>
          <Upload
            name="files"
            multiple
            accept="image/*"
            disabled={isAnalyzing}
            maxCount={MAX_COUNT}
            fileList={fileList}
            onChange={({ fileList: next }) => setFileList(next)}
            beforeUpload={(file) => {
              const currentCount = fileList.length;
              const currentTotalBytes = fileList.reduce(
                (sum, f) => sum + (f.size || 0),
                0,
              );

              // 🔢 개수 체크
              if (currentCount + 1 > MAX_COUNT) {
                message.error(
                  `파일은 최대 ${MAX_COUNT}개까지 업로드할 수 있어요.`,
                );
                return Upload.LIST_IGNORE;
              }

              // 타입 체크
              const okType = file.type.startsWith("image/");
              if (!okType) {
                message.error("이미지 파일(JPG, PNG 등)만 업로드할 수 있어요.");
                return Upload.LIST_IGNORE;
              }

              // 📏 파일당 크기 체크
              const fileMB = file.size / 1024 / 1024;
              if (fileMB > FILE_MAX_MB) {
                message.error(
                  `파일 1개 최대 ${FILE_MAX_MB}MB까지 업로드할 수 있어요.`,
                );
                return Upload.LIST_IGNORE;
              }

              // 총합 크기 체크
              const nextTotalMB = (currentTotalBytes + file.size) / 1024 / 1024;

              if (nextTotalMB > TOTAL_MAX_MB) {
                message.error(
                  `전체 업로드 용량은 ${TOTAL_MAX_MB}MB를 넘을 수 없어요.`,
                );
                return Upload.LIST_IGNORE;
              }

              return false;
            }}
          >
            <Button>
              파일 선택 (최대 {MAX_COUNT}개, 파일당 {FILE_MAX_MB}MB, 총{" "}
              {TOTAL_MAX_MB}MB)
            </Button>
          </Upload>
          <Button
            loading={isAnalyzing}
            disabled={isAnalyzing || fileList.length === 0}
            onClick={handleClickAnalyze}
          >
            분석 시작
          </Button>
        </Flex>
      </section>

      <section>[분석 결과 요약]</section>
      <section>[위험 조항별 카드]</section>
      <section>[한계 명시]</section>
    </Flex>
  );
}

export default App;
