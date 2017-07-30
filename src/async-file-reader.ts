import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import 'rxjs/add/observable/from'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeAll';

export class FileReaderResult {
    constructor(public name: string, public contents: string) { }
}

export class AsyncFileReader {
    static readAsText(file: File, encoding?: string): Observable<FileReaderResult> {
        return Observable.create((obs: Subscriber<FileReaderResult>) => {
            const reader = new FileReader();
            reader.onload = (ev: ProgressEvent) => {
                obs.next(new FileReaderResult(file.name, reader.result));
                obs.complete();
            };

            reader.onerror = (ev: ErrorEvent) => {
                obs.error(ev.error());
            };

            reader.readAsText(file, encoding);
        });

    }

    static readAllAsText(files: FileList, encoding?: string): Observable<FileReaderResult> {
        return Observable.from(files)
            .map((value: File) => AsyncFileReader.readAsText(value, encoding))
            .mergeAll();
    }
}

