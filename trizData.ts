
export interface TrizDefinition {
  id: number;
  name: string;
  definition: string;
  example: string;
}

export const TRIZ_DATA: Record<number, TrizDefinition> = {
  1: { id: 1, name: "분할 (Segmentation)", definition: "대상을 독립적인 부분으로 나누거나, 분해하기 쉽게 만들거나, 분할의 정도를 더 높이는 원리.", example: "가구를 조립식으로 제작, 블라인드를 여러 조각으로 나눔, 파이프를 유연한 마디로 연결." },
  2: { id: 2, name: "추출 (Taking out)", definition: "대상에서 방해되는 부분이나 성질만을 분리해 내거나, 반대로 필요한 부분이나 성질만을 뽑아내는 원리.", example: "소음이 심한 컴프레셔를 밖으로 뺌, 개 짖는 소리만 녹음하여 방범용으로 사용." },
  3: { id: 3, name: "국소적 품질 (Local Quality)", definition: "대상의 각 부분 구조를 균일한 것에서 불균일한 것으로 바꾸거나, 각 부분이 최적의 기능을 수행하도록 환경을 바꾸는 원리.", example: "지우개가 달린 연필, 도시락의 밥과 반찬 칸 구분, 손잡이 부분만 고무로 코팅." },
  4: { id: 4, name: "비대칭 (Asymmetry)", definition: "대상의 모양을 대칭에서 비대칭으로 바꾸거나, 이미 비대칭이라면 그 정도를 더 높이는 원리.", example: "한쪽으로 쏠린 타이어 트레드, 비대칭 안경 렌즈, 콘센트 플러그의 접지 핀." },
  5: { id: 5, name: "통합 (Consolidation)", definition: "동일하거나 유사한 기능을 하는 대상을 시간적 또는 공간적으로 합치는 원리.", example: "냉온 정수기, 복합기(프린터+스캐너), 멀티탭." },
  6: { id: 6, name: "다용도 (Universality)", definition: "한 대상이 여러 가지 다른 기능을 수행하게 하여 다른 부품의 필요성을 없애는 원리.", example: "스위스 아미 나이프, 소파 겸용 침대, 스마트폰." },
  7: { id: 7, name: "포개기 (Nesting)", definition: "한 물체 속에 다른 물체를 넣고, 그 속에 또 다른 물체를 넣는 식으로 공간을 활용하는 원리.", example: "러시아 인형(마트료시카), 안테나, 줌 렌즈." },
  8: { id: 8, name: "공중 부양 (Anti-weight)", definition: "대상의 무게를 양력이나 부력, 혹은 다른 힘(자기력 등)을 이용하여 상쇄시키는 원리.", example: "자기부상열차, 헬륨 풍선 광고, 수중익선." },
  9: { id: 9, name: "사전 반대 조치 (Preliminary Anti-action)", definition: "나중에 발생할 수 있는 나쁜 효과를 미리 상쇄시킬 수 있는 반대 조치를 취하는 원리.", example: "강화 유리의 압축 응력 처리, 엑스레이 촬영 시 납복 착용." },
  10: { id: 10, name: "사전 조치 (Preliminary Action)", definition: "대상의 요구되는 작용을 미리 수행하게 하거나, 물체를 가장 편리한 위치에 미리 배치하는 원리.", example: "커터칼의 칼집, 우표의 절취선, 미리 양념된 인스턴트 식품." },
  11: { id: 11, name: "사전 완충 (Cushion in Advance)", definition: "대상의 신뢰성이 낮을 경우, 미리 비상 수단을 준비하여 사고를 방지하는 원리.", example: "에어백, 낙하산, 데이터 백업." },
  12: { id: 12, name: "굴리기 (Equipotentiality)", definition: "위치 에너지가 변하지 않도록 작업 조건을 변경하여 물체를 올리거나 내릴 필요를 없애는 원리.", example: "자동차 정비용 피트, 수평 에스컬레이터, 운하의 갑문." },
  13: { id: 13, name: "거꾸로 하기 (Inversion)", definition: "문제를 해결하기 위해 반대 방향으로 조치하거나, 움직이는 부분을 고정하고 고정된 부분을 움직이게 하는 원리.", example: "러닝머신(사람은 제자리, 바닥이 움직임), 주물 틀을 움직이고 쇳물을 고정." },
  14: { id: 14, name: "구형화 (Spheroidality)", definition: "직선 부분을 곡선으로, 평면을 구면으로 바꾸거나, 직선 운동을 회전 운동으로 바꾸는 원리.", example: "아치형 다리, 볼펜 볼, 컴퓨터 마우스의 볼(과거)." },
  15: { id: 15, name: "역동성 (Dynamism)", definition: "대상이 작업 단계마다 최상의 성능을 발휘하도록 가변적으로 만들거나, 고정된 대상을 움직이게 만드는 원리.", example: "접이식 자전거, 인체공학 의자, 가변익 항공기." },
  16: { id: 16, name: "과부족 조치 (Partial or Excessive Actions)", definition: "100% 완벽한 해결이 어렵다면, 조금 덜 하거나 조금 더 해서 문제를 단순화하는 원리.", example: "페인트 통을 담가서 칠하기(과잉), 스텐실 인쇄." },
  17: { id: 17, name: "차원 변경 (Another Dimension)", definition: "물체를 1차원에서 2차원, 3차원으로 움직이거나, 층을 여러 겹으로 쌓거나 뒤집어 활용하는 원리.", example: "2층 버스, 적층형 반도체, 홀로그램." },
  18: { id: 18, name: "기계적 진동 (Mechanical Vibration)", definition: "대상을 진동시키거나, 진동수를 공진 주파수까지 높여서 활용하는 원리.", example: "초음파 세척기, 전동 칫솔, 진동 벨." },
  19: { id: 19, name: "주기적 작용 (Periodic Action)", definition: "연속적인 작용을 주기적인 작용(펄스)으로 바꾸거나, 주기를 변경하는 원리.", example: "ABS 브레이크, 점멸 신호등, 임팩트 렌치." },
  20: { id: 20, name: "유용 작용의 지속 (Continuity of Useful Action)", definition: "작동을 멈추지 않고 계속 수행하게 하거나, 모든 부품이 쉬지 않고 가동되게 하는 원리.", example: "플라이휠, 잉크젯 프린터의 연속 공급, 회전문." },
  21: { id: 21, name: "고속 처리 (Skipping)", definition: "유해하거나 위험한 공정을 아주 빠른 속도로 처리하여 영향을 최소화하는 원리.", example: "주사 빨리 놓기, 파이프 절단 시 고속 회전, 뜨거운 물건을 빠르게 지나가게 함." },
  22: { id: 22, name: "전화위복 (Blessing in Disguise)", definition: "유해한 요소를 유용한 것으로 바꾸거나, 유해한 요소 두 개를 결합하여 상쇄시키는 원리.", example: "예방주사(독을 약으로), 폐열 난방, 쓰레기 매립지 가스 발전." },
  23: { id: 23, name: "피드백 (Feedback)", definition: "과정이나 결과를 다시 입력으로 보내어 시스템을 제어하거나 조절하는 원리.", example: "온도 조절기, 자동 항법 장치, 소음 제거 헤드폰(노이즈 캔슬링)." },
  24: { id: 24, name: "매개체 (Intermediary)", definition: "중간에 다른 물체를 매개로 이용하거나, 쉽게 제거할 수 있는 물체를 잠시 사용하는 원리.", example: "기타 피크, 요리용 장갑, 촉매." },
  25: { id: 25, name: "셀프 서비스 (Self-service)", definition: "대상이 스스로를 서비스하거나 수리하게 하고, 버려지는 자원을 스스로 활용하게 하는 원리.", example: "자동 급유 장치, 스스로 숫돌을 가는 칼, 자가 치유 소재." },
  26: { id: 26, name: "복제 (Copying)", definition: "비싸거나 부서지기 쉬운 원본 대신 저렴하고 간단한 복제본을 사용하는 원리.", example: "시뮬레이션, 가상현실(VR), 모조 보석." },
  27: { id: 27, name: "일회용 (Cheap Short-living Objects)", definition: "비싸고 내구성 있는 것 대신 싸고 수명이 짧은 것을 여러 개 사용하는 원리.", example: "종이컵, 일회용 주사기, 메모지." },
  28: { id: 28, name: "기계 시스템 대체 (Mechanics Substitution)", definition: "기계적 시스템을 광학, 음향, 후각 등 다른 물리적 장(Field)으로 대체하는 원리.", example: "전자 코, 광학 마우스, 음성 인식." },
  29: { id: 29, name: "공기/유압 사용 (Pneumatics and Hydraulics)", definition: "고체 부품 대신 기체나 액체를 이용하여 완충, 지지, 구동하는 원리.", example: "에어 쿠션, 유압 브레이크, 튜브 타이어." },
  30: { id: 30, name: "유연한 막/얇은 필름 (Flexible Shells and Thin Films)", definition: "일반적인 구조물 대신 얇은 막이나 필름을 사용하여 격리하거나 보호하는 원리.", example: "비닐 하우스, 콘택트 렌즈, 버블 랩." },
  31: { id: 31, name: "다공성 물질 (Porous Materials)", definition: "대상을 구멍이 많은 다공성으로 만들거나, 다공성 요소를 삽입하여 이용하는 원리.", example: "스펀지, 고어텍스, 스티로폼." },
  32: { id: 32, name: "색깔 변화 (Color Changes)", definition: "대상의 색을 바꾸거나 투명도를 조절하여 상태를 식별하거나 활용하는 원리.", example: "변색 렌즈, 리트머스 종이, 야광 페인트." },
  33: { id: 33, name: "동질성 (Homogeneity)", definition: "대상과 상호작용하는 주변 물체를 같은 재료나 비슷한 특성을 가진 재료로 만드는 원리.", example: "같은 재질의 용접봉 사용, 다이아몬드를 다이아몬드로 가공." },
  34: { id: 34, name: "폐기 및 재생 (Discarding and Recovering)", definition: "기능을 다한 부품은 버리거나(분해, 증발), 소모된 부품을 작동 중에 복구하는 원리.", example: "로켓의 다단 분리, 캡슐 약, 자동 감기는 전선." },
  35: { id: 35, name: "속성 변환 (Parameter Changes)", definition: "대상의 물리적 상태(고체, 액체, 기체), 농도, 밀도, 유연성, 온도 등을 바꾸는 원리.", example: "액체 비누, 동결 건조 식품, 형상 기억 합금." },
  36: { id: 36, name: "상전이 (Phase Transitions)", definition: "물질의 상이 변할 때(고체->액체 등) 발생하는 현상(부피 변화, 열 흡수/방출)을 이용하는 원리.", example: "히트 파이프, 팽창 온도계, 드라이아이스 냉각." },
  37: { id: 37, name: "열팽창 (Thermal Expansion)", definition: "재료의 열팽창이나 수축을 이용하거나, 열팽창 계수가 다른 재료를 결합하여 이용하는 원리.", example: "바이메탈, 철로의 이음매, 꽉 낀 뚜껑 가열하여 열기." },
  38: { id: 38, name: "강산화제 (Strong Oxidants)", definition: "일반 공기 대신 산소가 풍부한 공기나 순수 산소, 오존 등을 사용하여 반응을 촉진하는 원리.", example: "산소 용접, 고압 산소 치료, 오존 살균." },
  39: { id: 39, name: "불활성 분위기 (Inert Atmosphere)", definition: "일반적인 환경을 불활성 가스 환경으로 바꾸거나 진공 상태를 이용하는 원리.", example: "전구 속 아르곤 가스, 진공 포장, 질소 충전 과자 봉지." },
  40: { id: 40, name: "복합 재료 (Composite Materials)", definition: "단일 재료 대신 복합 재료를 사용하여 장점을 결합하는 원리.", example: "탄소 섬유, 강화 콘크리트, 유리 섬유." }
};
