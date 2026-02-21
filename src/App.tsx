import { Button, Flex } from "antd";
import "./App.css";

function App() {
  return (
    <Flex vertical gap={20}>
      {/* 파일 업로드 영역 */}
      <section>
        <Flex vertical gap={8} align="center">
          <span>계약서를 업로드하세요</span>
          <span>(PDF / 이미지)</span>
          <Button>파일 선택</Button>
        </Flex>
      </section>

      <section>[분석 결과 요약]</section>
      <section>[위험 조항별 카드]</section>
      <section>[한계 명시]</section>
    </Flex>
  );
}

export default App;
