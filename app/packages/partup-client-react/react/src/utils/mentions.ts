/**
 * Replace mentions in a message with hyperlinks
 *
 * @name decode
 *
 * @param {String} message
 *
 * @return {String}
 */
export function decode(message: string): string {
    return message.replace(/\[Supporters:(?:([^\]]+))?\]/g, (m: string, users: string) => {
        // decode supporter mentions
        return `<a data-hovercontainer="HoverContainer_upperList" data-hovercontainer-context="${
           users
        }" class="pu-mention-group pur-mention-group">Supporters</a>`;
    }).replace(/\[Partners:(?:([^\]]+))?\]/g, (m: string, users: string) => {
        // decode upper mentions
        return `<a data-hovercontainer="HoverContainer_upperList" data-hovercontainer-context="${
            users
        }" class="pu-mention-group pur-mention-group">Partners</a>`;
    }).replace(/\[user:([^\]|]+)(?:\|([^\]]+))?\]/g, (m: string, _id: string, name: string) => {
        // decode invividual mentions
        return `<a href="profile/${
            _id
        }" data-hovercontainer="HoverContainer_upper" data-hovercontainer-context="${
            _id
        }" class="pu-mention-user pur-mention-user">${
            name
        }</a>`;
    });
}
