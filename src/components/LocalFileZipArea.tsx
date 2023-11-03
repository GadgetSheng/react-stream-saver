/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import * as fflate from "fflate";
import { createDownloadStream } from "../utils";

function concatUnit8Array(chunks: Uint8Array[]) {
    const len = chunks.reduce((prev, cur) => prev + cur.length, 0);
    const mergeArr = new Uint8Array(len);
    chunks.reduce((prev, cur) => {
        mergeArr.set(cur, prev);
        return prev + cur.length;
    }, 0);
    return mergeArr;
}

function bufferMacroTaskChunk(cb: (chunk: Uint8Array) => void) {
    const chunks: Uint8Array[] = [];
    let flag = false;
    return (chunk: Uint8Array) => {
        chunks.push(chunk);
        if (!flag) {
            flag = true;
            setTimeout(() => {
                console.log('bufferMacroTask start');
                flag = false;
                chunks.length = 0;
                cb(concatUnit8Array(chunks));
            }, 0);
        }
    }
}
const onPutDirectory = async (e: any) => {
    const files: FileList = e.target.files;
    const streamList: Array<[ReadableStreamDefaultReader, fflate.ZipDeflate]> = [];
    const writableStream = await createDownloadStream("localFolder.zip");
    const stream = writableStream.getWriter();
    let iterator = read();
    const zip = new fflate.Zip((err: any, data: Uint8Array, final: any) => {
        if (err || final) { stream.close(); }
        else {
            const buffer = bufferMacroTaskChunk((chunk: Uint8Array) => {
                stream.write(chunk).then(() => iterator.next());
            })
            buffer(data);
        }
    });
    async function* read() {
        for (let i = 0; i < streamList.length; i++) {
            const [reader, zipStream] = streamList[i];
            while (true) {
                console.log('read');
                const { done, value = new Uint8Array() } = await reader.read();
                console.log('push', i, done);
                zipStream.push(value);
                console.log('yield');
                yield;
                console.log('next');
                if (done) break;
            }
        }
        zip.end();
    }
    iterator = read();


    for (let i = 0; i < files.length; i++) {
        const file = files.item(i)!;
        const zipStream = new fflate.ZipDeflate(file.name, { level: 5 });
        streamList.push([file.stream().getReader(), zipStream]);
        zip.add(zipStream);
    }
    console.log('start');
    iterator.next();
}

function LocalFileZipArea() {
    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        inputRef.current?.addEventListener('change', onPutDirectory);
    }, []);
    return (<>
        <button onClick={() => inputRef.current?.click()}>流式-文件压缩</button >
        <input ref={inputRef} multiple type="file" hidden />
    </>);
}

export default LocalFileZipArea