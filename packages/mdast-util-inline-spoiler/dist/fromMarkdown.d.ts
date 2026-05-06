import { MdastExtension } from 'mdast-util-from-markdown/types';
import * as Uni from 'unist';
export interface SpoilerNode extends Uni.Literal {
    type: 'spoiler';
    value: string;
}
export declare const spoilerFromMarkdown: MdastExtension;
