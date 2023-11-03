import { useEffect, useRef } from "react";
import { createDownloadStream } from "../utils";

function LocalFileDownloadArea() {
    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.addEventListener('change', async (e: any) => {
                const [file] = e.target.files!;
                if (file) {
                    const reader = file.stream().getReader();
                    const writableStream = await createDownloadStream(file.name);
                    const writable = writableStream.getWriter();
                    const pump = async () => {
                        console.log('读取本地文件数据')
                        const { done, value } = await reader.read();
                        if (done) return writable.close();
                        console.log('向下载线程下入数据', value);
                        await writable.write(value);
                        pump();
                    }
                    pump();
                }
            })
        }
    }, []);
    const onDownload = () => {
        if (inputRef.current) {
            inputRef.current.click()
        }
    }
    return (<>
        <button onClick={onDownload}>本地流式文件下载</button>
        <input ref={inputRef} type="file" hidden />
    </>)
}

export default LocalFileDownloadArea