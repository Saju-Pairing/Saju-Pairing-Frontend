// src/utils/pdf.ts
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const saveAsPdf = async (elementOrId: HTMLElement | string, fileName: string) => {
    const element = typeof elementOrId === 'string' ? document.getElementById(elementOrId) : elementOrId;
    if (!element) return;

    // 1. 전체 영역을 캡처 (스크롤 무시)
    const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#07060c',
        scrollY: -window.scrollY,
        windowHeight: element.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/png');

    // 🚀 핵심: 이미지의 실제 가로/세로 비율을 mm 단위로 환산
    const imgWidth = 210; // 가로는 A4 표준(210mm)으로 고정
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // 🚀 PDF 생성 시 세로 길이를 imgHeight로 동적 할당!
    // [가로, 세로]를 배열로 넘기면 해당 크기의 커스텀 PDF가 생성됩니다.
    const pdf = new jsPDF('p', 'mm', [imgWidth, imgHeight]);

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(fileName);
};