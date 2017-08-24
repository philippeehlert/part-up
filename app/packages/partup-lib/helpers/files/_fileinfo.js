
export default class FileInfo {
    constructor(category, extension, mime, signatures, icon) {
        this.category = category;
        this.extension = extension;
        this.mime = mime;
        this.signatures = signatures;
        
        if (icon) {
            this.icon = icon;
        }
    }
}
