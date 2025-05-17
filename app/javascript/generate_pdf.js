import html2pdf from 'html2pdf.js';

document.addEventListener('turbo:load', () => {
  const button = document.getElementById('client-pdf-button');
  if (!button) return;

  button.addEventListener('click', () => {
    const element = document.getElementById('report-container');
    if (!element) {
      alert("PDF化対象が見つかりませんでした。");
      return;
    }

    const options = {
      margin:       0.1,
      filename:     'noise_proof.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
    };

    html2pdf().set(options).from(element).save();
  });
});
