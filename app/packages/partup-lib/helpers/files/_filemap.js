/**
 * Copyright (C) 2017 Part-up
 * GNU AFFERO GENERAL PUBLIC LICENSE
 * Version 3, 19 November 2007
 */

export default _filemap = [
    {
        category: 'image',
        data: [
            {
                extension: 'bmp',
                mime: 'image/bmp',
                signatures: [
                    {
                        bytes: '424D',
                        size: 2,
                        offset: 0,
                    },
                ],
            },
            {
                extension: 'gif',
                mime: 'image/gif',
                signatures: [
                    {
                        bytes: '47494638',
                        size: 4,
                        offset: 0,
                    }
                ]
            },
            {
                extension: 'jpg',
                mime: 'image/jpeg',
                signatures: [
                    {
                        bytes: 'FFD8FFE0',
                        size: 4,
                        offset: 0,
                    },
                    {
                        bytes: 'FFD8FFE1',
                        size: 4,
                        offset: 0,
                    },
                    {
                        bytes: 'FFD8FFE8',
                        size: 4,
                        offset: 0,
                    },
                    {
                        bytes: 'FFD8FFDB',
                        size: 4,
                        offset: 0,
                    },
                ],
            },
            {
                extension: 'jpeg',
                mime: 'image/jpeg',
                signatures: [
                    {
                        bytes: 'FFD8FFE0',
                        size: 4,
                        offset: 0,
                    },
                    {
                        bytes: 'FFD8FFE2',
                        size: 4,
                        offset: 0,
                    },
                    {
                        bytes: 'FFD8FFE3',
                        size: 4,
                        offset: 0,
                    },
                    {
                        bytes: 'FFD8FFDB',
                        size: 4,
                        offset: 0,
                    },
                ],
            },
            {
                extension: 'png',
                mime: 'image/png',
                signatures: [
                    {
                        bytes: '89504E470D0A1A0A',
                        size: 8,
                        offset: 0,
                    },
                ],
            },
            {
                extension: 'webp',
                mime: 'image/webp',
                signatures: [
                    {
                        bytes: '52494646', // + filesize + 57 45 42 50, don't know how to do this yet.
                        size: 4,
                        offset: 0,
                    },
                ],
            },
            {
                extension: 'tif',
                mime: 'image/tiff',
                signatures: [
                    {
                        bytes: '49492A00',
                        size: 4,
                        offset: 0,
                    },
                ],
            },
            {
                extension: 'tiff',
                mime: 'image/tiff',
                signatures: [
                    {
                        bytes: '49492A00',
                        size: 4,
                        offset: 0,
                    },
                ],
            },
        ],
    },
    // {
    //     // TODO
    //     category: 'audio',
    //     data: [
    //         {
    //             extension: 'aac',
    //             mime: 'audio/aac',
    //             signatures: [
    //                 {
    //                     bytes: 'FFF1',
    //                     size: 2,
    //                     offset: 0,
    //                 },
    //                 {
    //                     bytes: 'FFF9',
    //                     size: 2,
    //                     offset: 0,
    //                 }
    //             ]
    //         },
    //         {
    //             extension: 'oga',
    //             mime: 'audio/ogg',
    //             signatures: [
    //                 {
    //                     bytes: '4F67675300020000000000000000',
    //                     size: 14,
    //                     offset: 0,
    //                 },
    //             ]
    //         },
    //         {
    //             extension: 'ogg',
    //             mime: 'audio/ogg',
    //             signatures: [
    //                 {
    //                     bytes: '4F67675300020000000000000000',
    //                     size: 14,
    //                     offset: 0,
    //                 },
    //             ]
    //         },
    //         {
    //             extension: 'wav',
    //             mime: 'audio/x-wav',
    //             signatures: [
    //                 {
    //                     bytes: '52494646',
    //                     size: 4,
    //                     offset: 0,
    //                 },
    //             ]
    //         },
    //         {
    //             extension: 'weba',
    //             mime: 'audio/webm',
    //             signatures: [
    //                 {
    //                     bytes: '1A45DFA3',
    //                     size: 4,
    //                     offset: 0,
    //                 }
    //             ]
    //         },
    //         {
    //             extension: 'aif',
    //             mime: 'audio/aiff',
    //         },
    //         {
    //             extension: 'aiff',
    //             mime: 'audio/aiff',
    //             signatures: [
    //                 {
    //                     bytes: '464F524D00',
    //                     size: 4,
    //                     offset: 0,
    //                 }
    //             ]
    //         },
    //     ]
    // },
    // {
    //     // TODO
    //     category: 'video',
    //     data: [
    //         {
    //             extension: '',
    //             mime: '',
    //             signatures: [
    //                 {
    //                     bytes: '',
    //                     size: ,
    //                     offset: ,
    //                 }
    //             ]
    //         }
    //     ]
    // },
    {
        category: 'document',
        icon: 'doc.svg',
        data: [
            {
                extension: 'doc',
                mime: 'application/msword',
                signatures: [
                    {
                        // Microsoft Office document
                        bytes: 'D0CF11E0A1B11AE1',
                        size: 8,
                        offset: 0,
                    },
                    {
                        // Perfect Office document
                        bytes: 'CF11E0A1B11AE100',
                        size: 8,
                        offset: 0,
                    },
                    {
                        // Word 2.0
                        bytes: 'DBA52D00',
                        size: 4,
                        offset: 0,
                    },
                    {
                        // Word document subheader
                        bytes: 'ECA5C100',
                        size: 4,
                        offset: 512,
                    },
                ],
            },
            {
                extension: 'docx',
                mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                signatures: [
                    {
                        bytes: '504B0304',
                        size: 4,
                        offset: 0,
                    },
                    {
                        bytes: '504B0506',
                        size: 4,
                        offset: 0,
                    },
                    {
                        bytes: '504B0708',
                        size: 4,
                        offset: 0,
                    },
                ],
            },
            {
                extension: 'dotx',
                mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
                signatures: [
                    {
                        bytes: '504B0304',
                        size: 4,
                        offset: 0,
                    },
                    {
                        bytes: '504B0506',
                        size: 4,
                        offset: 0,
                    },
                    {
                        bytes: '504B0708',
                        size: 4,
                        offset: 0,
                    },
                ],
            },
            {
                extension: 'odt',
                mime: 'application/vnd.oasis.opendocument.text',
                signatures: [
                    {
                        bytes: '504B0304',
                        size: 4,
                        offset: 0,
                    },
                    {
                        bytes: '504B0506',
                        size: 4,
                        offset: 0,
                    },
                    {
                        bytes: '504B0708',
                        size: 4,
                        offset: 0,
                    },
                ],
            },
            {
                extension: 'rtf',
                mime: 'application/rtf',
                signatures: [
                    {
                        bytes: '7B5C72746631',
                        size: 6,
                        offset: 0,
                    },
                ],
            },
            {
                extension: 'pdf',
                mime: 'application/pdf',
                icon: 'pdf.svg',
                signatures: [
                    {
                        bytes: '25504446',
                        size: 4,
                        offset: 0,
                    },
                ],
            },
            {
                extension: 'txt',
                mime: 'text/plain',
                signatures: [
                    {
                        bytes: '464F524Dnnnnnnnn46545854',
                        size: 12,
                        offset: 0,
                    },
                ],
            },
            {
                extension: 'pages',
                mime: 'application/vnd.apple.pages',
            },
            {
                mime: 'application/vnd.google-apps.document',
            },
        ],
    },
    {
        category: 'presentation',
        icon: 'ppt.svg',
        data: [
            {
                extension: 'ppt',
                mime: 'application/vnd.ms-powerpoint',
                signatures: [
                    {
                        bytes: 'D0CF11E0A1B11AE1',
                        size: 8,
                        offset: 0,
                    },
                ],
            },
            {
                extension: 'pptx',
                mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                signatures: [
                    {
                        bytes: '504B0304',
                        size: 4,
                        offset: 0,
                    },
                    {
                        bytes: '504B0506',
                        size: 4,
                        offset: 0,
                    },
                    {
                        bytes: '504B0708',
                        size: 4,
                        offset: 0,
                    },
                ],
            },
            {
                extension: 'pps',
                mime: 'application/vnd.ms-powerpoint',
                signatures: [
                    {
                        bytes: 'D0CF11E0A1B11AE1',
                        size: 8,
                        offset: 0,
                    },
                ],
            },
            {
                extension: 'ppsx',
                mime: 'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
            },
            {
                extension: 'odp',
                mime: 'application/vnd.oasis.opendocument.presentation',
                signatures: [
                    {
                        bytes: '504B0304',
                        size: 4,
                        offset: 0,
                    },
                    {
                        bytes: '504B0506',
                        size: 4,
                        offset: 0,
                    },
                    {
                        bytes: '504B0708',
                        size: 4,
                        offset: 0,
                    },
                ],
            },
            {
                mime: 'application/vnd.google-apps.presentation',
            },
        ],
    },
    {
        category: 'spreadsheet',
        icon: 'xls.svg',
        data: [
            {
                extension: 'xls',
                mime: 'application/vnd.ms-excel',
                signatures: [
                    {
                        bytes: 'D0CF11E0A1B11AE1',
                        size: 8,
                        offset: 0,
                    }
                ]
            },
            {
                extension: 'xlsx',
                mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                signatures: [
                    {
                        bytes: '504B0304',
                        size: 4,
                        offset: 0,
                    },
                    {
                        bytes: '504B0506',
                        size: 4,
                        offset: 0,
                    },
                    {
                        bytes: '504B0708',
                        size: 4,
                        offset: 0,
                    }
                ]
            },
            {
               extension: 'ods',
               mime: 'application/vnd.oasis.opendocument.spreadsheet',
               signatures: [
                    {
                        bytes: '504B0304',
                        size: 4,
                        offset: 0,
                    },
                    {
                        bytes: '504B0506',
                        size: 4,
                        offset: 0,
                    },
                    {
                        bytes: '504B0708',
                        size: 4,
                        offset: 0,
                    }
               ]
            },
            {
                extension: 'csv',
                mime: 'text/csv',
            },
            {
                extension: 'numbers',
                mime: 'application/vnd.apple.numbers', // Some systems read it as `application/zip`
            },
            {
                mime: 'application/vnd.google-apps.spreadsheet',
            },
        ],
    },
    {
        category: 'archive',
        icon: 'zip.svg', // None-existing
        data: [
            {
                extension: 'zip',
                mime: 'application/zip',
                signatures: [
                    {
                        bytes: '504B0304',
                        size: 4,
                        offset: 0,
                    }
                ]
            },
            {
                extension: 'rar',
                mime: 'application/x-rar-compressed',
                signatures: [
                    {
                        // v4
                        bytes: '526172211A0700',
                        size: 7,
                        offset: 0,
                    },
                    {
                        // v5
                        bytes: '526172211A070100',
                        size: 8,
                        offset: 0,
                    }
                ]
            },
            {
                extension: '7z',
                mime: 'application/zip',
                signatures: [
                    {
                        bytes: '377ABCAF271C',
                        size: 6,
                        offset: 0,
                    }
                ]
            },
            {
                extension: 'gz',
                mime: 'application/gzip',
                signatures: [
                    {
                        bytes: '1F8B08',
                        size: 3,
                        offset: 0,
                    }
                ]
            },
            {
                extension: 'tgz',
                mime: 'application/gzip',
                signatures: [
                    {
                        bytes: '1F8B08',
                        size: 3,
                        offset: 0,
                    }
                ]
            }
        ]
    },
    {
        category: 'file',
        icon: 'file.svg',
        data: [
            {
                extension: 'psd',
                mime: 'application/photoshop',
                signatures: [
                    {
                        bytes: '38425053',
                        size: 4,
                        offset: 0,
                    }
                ]
            },
            {
                extension: 'ai',
                mime: 'application/illustrator',
                signatures: [
                    {
                        bytes: '25504446',
                        size: 4,
                        offset: 0,
                    },
                ],
            },
            {
                // Why?
                extension: 'eps',
                mime: 'application/postscript',
            },
            {
                extension: 'key',
            },
            {
                extension: 'keynote',
                mime: 'application/vnd.apple.keynote'
            },
        ],
    },
];
