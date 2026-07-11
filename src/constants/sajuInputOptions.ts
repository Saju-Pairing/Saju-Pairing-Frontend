// 1. 연도 (1950년부터 2029년까지, 약 80개)
export const years = Array.from({ length: 80 }, (_, i) => String(1950 + i));

// 2. 월 (01부터 12까지)
export const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

// 3. 일 (01부터 31까지)
export const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));

// 4. 헤어진 기간 옵션
export const breakupDurOptions = [
  { label: '선택 안 함', value: '' },
  { label: '1개월 미만', value: '1개월 미만' },
  { label: '1~3개월', value: '1~3개월' },
  { label: '3~6개월', value: '3~6개월' },
  { label: '6개월~1년', value: '6개월~1년' },
  { label: '1년 이상', value: '1년 이상' },
];

// 5. 태어난 시간(시) 옵션
export const timeOptions = [
  { label: '모름', value: '' },
  { label: '자시 (23~01시)', value: '23:30' },
  { label: '축시 (01~03시)', value: '01:30' },
  { label: '인시 (03~05시)', value: '03:30' },
  { label: '묘시 (05~07시)', value: '05:30' },
  { label: '진시 (07~09시)', value: '07:30' },
  { label: '사시 (09~11시)', value: '09:30' },
  { label: '오시 (11~13시)', value: '11:30' },
  { label: '미시 (13~15시)', value: '13:30' },
  { label: '신시 (15~17시)', value: '15:30' },
  { label: '유시 (17~19시)', value: '17:30' },
  { label: '술시 (19~21시)', value: '19:30' },
  { label: '해시 (21~23시)', value: '21:30' },
];