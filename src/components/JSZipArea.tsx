import { useEffect, useRef } from "react";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

function JSZipArea() {
    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.addEventListener('change', async (e: any) => {
                const [file] = e.target.files!;
                if (file) {
                    const zip = new JSZip();
                    zip.file(file.name, file)
                    const blob = await zip.generateAsync({
                        type: "blob",
                        compression: "DEFLATE",
                        compressionOptions: { level: 9 }
                    })
                    saveAs(blob, "zip-it.zip");
                }
            })
        }
    }, []);
    const onClickZip = () => {
        if (inputRef.current) {
            inputRef.current.click()
        }
    }
    return <>
        <button onClick={onClickZip}>使用-JSZip-压缩文件</button>
        <input ref={inputRef} multiple type="file" hidden />
    </>;
}

export default JSZipArea