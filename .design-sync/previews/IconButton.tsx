import { IconButton } from "applume";

export const Actions = () => (
  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
    <IconButton icon="copy" label="Duplicate" onClick={() => {}} />
    <IconButton icon="edit" label="Edit" onClick={() => {}} />
    <IconButton icon="trash" label="Delete" danger onClick={() => {}} />
  </div>
);
