import { Button, Flex, message, Upload, type UploadProps } from "antd";
import "./App.css";

function App() {
  const props: UploadProps = {
    name: "file",
    action: "http://localhost:3000/api/analyze",
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  return (
    <Flex vertical gap={20}>
      {/* 파일 업로드 영역 */}
      <section>
        <Flex vertical gap={8} align="center">
          <span>계약서를 업로드하세요</span>
          <span>(PDF / 이미지)</span>
          <Upload {...props}>
            <Button>파일 선택</Button>
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
