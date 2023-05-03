// If absolute URL from the remote server is provided, configure the CORS
// header on that server.

const customPDF = (wrapperId, pdfSourcePath, workJsPath) => {

    if (!wrapperId || !pdfSourcePath) {
        console.log('wrapperId 혹은 pdfSourcePath 가 입력되지 않음');
        return;
    }

    const wrapper = document.getElementById(wrapperId);

    if (!wrapper) {
        console.log('입력된 wrapperId로 엘레멘트 찾을 수 없음');
        return;
    }

    // Loaded via <script> tag, create shortcut to access PDF.js exports.
    const pdfjsLib = window['pdfjs-dist/build/pdf'];

    // The workerSrc property shall be specified.
    pdfjsLib.GlobalWorkerOptions.workerSrc = workJsPath || 'https://mozilla.github.io/pdf.js/build/pdf.worker.js';
    console.log('workerJsLoadFrom', pdfjsLib.GlobalWorkerOptions.workerSrc);

    // Asynchronous download of PDF

    pdfjsLib.getDocument(pdfSourcePath).promise.then((pdfDoc) => {

        console.log('PDF loaded');
        const lastPage = pdfDoc.numPages;
        for (let pageNumber = 1; pageNumber <= lastPage; pageNumber++) {
            pdfDoc.getPage(pageNumber).then(function (page) {

                console.log('Page ' + pageNumber + ' loaded');

                let scale = 1.5;
                let viewport = page.getViewport({ scale: scale });

                // Prepare canvas using PDF page dimensions
                let canvas = document.createElement('canvas');
                wrapper.appendChild(canvas);
                var context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                // Render PDF page into canvas context
                let renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
                let renderTask = page.render(renderContext);
                renderTask.promise.then(function () {
                    console.log('Page rendered');
                });
            });
        }

    }, (reason) => {
        // PDF loading error
        console.error(reason);
    });

}