import StarterKit from '@tiptap/starter-kit';
import {Markdown} from '@tiptap/markdown';
import {TableKit} from '@tiptap/extension-table';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Image from '@tiptap/extension-image';
export const richTextExtensions=()=>[
 StarterKit.configure({link:{openOnClick:false},underline:false}),
 TableKit.configure({table:{resizable:false}}),TaskList,TaskItem.configure({nested:true}),
 Image.configure({allowBase64:true}),Markdown.configure({markedOptions:{gfm:true,breaks:true}}),
];
