# 🌲 Afforest

This project demonstrates how to use [Afforest](https://www.npmjs.com/package/afforest) — a highly flexible and extensible React component for rendering and modifying recursive tree structures.

## 📦 Installation

First, install the Afforest package:

```bash
npm install afforest
```

## 🌳 Tree Node Definition
In this example, we define a simple tree structure using the TreeNode class:

```TypeScript
export class TreeNode {
  name!: string;
  children?: TreeNode[];
}
```
Each TreeNode may have zero or more child nodes stored in an optional children array.

## 🛠 Usage
This is a very basic example of how to use the Forest component from Afforest to render a tree made up of TreeNode objects.

More examples on [StackBlitz - Afforest](https://stackblitz.com/edit/stackblitz-starters-3neksp?file=README.md)

```TypeScript
import React, { useState } from "react";
import Forest from "afforest";

const ExampleTree = () => {
  const [treeNodes, setTreeNodes] = useState<TreeNode[]>([])

  return (
    <Forest<TreeNode>
      getSubTreesCallback={(node) => node.children ?? []}
      trees={treeNodes}
      renderItem={(node) => (
        <div className="pl-5 ml-0.5 border-l-2 border-slate-600 ">
          <div className="bg-slate-700/50 w-fit px-2 rounded my-1">{node.item.name}</div>
          {node.renderSubTrees()}
        </div>
      )}
    />
  )
}

export default ExampleTree
```


## 📘 Forest Component API

| Prop Name            | Type                                              | Required | Description |
|----------------------|---------------------------------------------------|----------|-------------|
| `trees`              | `T[]`                                             | ✅       | The root-level array of tree nodes to render. |
| `getSubTreesCallback`| `(node: T) => T[]`                                | ✅       | Function that returns the children array from a node. |
| `setSubTreesCallback`| `(node: T, children: T[]) => void`                | ✅*      | Function that updates a node's children. Required if tree is editable. |
| `onTreesChange`      | `(newTrees: T[]) => void`                         | ✅*      | Callback called with the updated tree when changes occur. Required for editing. |
| `renderItem`         | `(node: ForestNode<T>) => React.ReactNode`        | ✅       | Function that renders a single node. You can use `node.renderSubTrees()` to render its children recursively. |


> 📝 **Note:** `T` is the generic type of your tree nodes — it can be anything (e.g., `TreeNode`) as long as you provide the appropriate accessors via `getSubTreesCallback` and `setSubTreesCallback`.

## 🌿 ForestNode API

Each node rendered using the `<Forest />` component is wrapped in a `ForestNode<TItem, TProps>` instance. This provides helpful metadata and methods to interact with the tree programmatically.

| Property / Method     | Type                                                      | Description |
|------------------------|-----------------------------------------------------------|-------------|
| `item`                | `TItem`                                                   | The actual data item represented by this tree node. |
| `depth`               | `number`                                                  | Depth level of the node in the tree (0 = root level). |
| `treeLocationIndex`   | `number[]`                                                | Path to this node in the overall tree structure (e.g., `[0, 1, 2]`). |
| `localLocationIndex`  | `number`                                                  | Index of this node among its siblings. |
| `divRef`              | `RefObject<HTMLDivElement>`                               | React ref to the node’s container element (useful for scrolling or focusing). |
| `update`              | `(changedItem: TItem, idxs?: number[]) => void`           | Replace this node’s item with a new one. Optionally provide a path override. |
| `delete`              | `(idxs?: number[]) => void`                               | Delete this node from its parent. Optionally provide a path override. |
| `insertChild`         | `(newItem: TItem, idx?: number, idxs?: number[]) => void` | Insert a new child node. Optionally provide an index and path override. |
| `renderSubTrees`      | `(props: TProps) => React.JSX.Element`                    | Renders this node’s children recursively using the current `renderItem`. |
| `parentProps`         | `TProps \| undefined`                                     | Props passed from the parent during render (if any). |
| `parentNode`          | `ForestNode<TItem, TProps> \| undefined`                  | Reference to the parent node (if any). |

> 🧠 **Tip**: Use `update`, `delete`, and `insertChild` inside your `renderItem` function to create interactive nodes (e.g., buttons to modify tree structure).



## 🧠 Why Use Afforest?
- Flexible Data Models: Use any type T as a tree node, as long as it has a property that holds an array of its own type. You’re not locked into using a specific key like children.
- Efficient Updates: Only update the parts of the tree that change, improving performance and user experience.
- Customizable Rendering: Easily define how each node is displayed with your own components.
- Interactive UI: Enables features like drag-and-drop, inline editing, and more, all without rewriting your recursive tree logic.

## 🪴 License
MIT


