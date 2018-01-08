/**
 * A file info object to provide context for an extension
 *
 * @export
 * @class FileInfo
 * @property {String} category
 * @property {String} extension
 * @property {String} mime
 * @property {[String]}
 */
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
