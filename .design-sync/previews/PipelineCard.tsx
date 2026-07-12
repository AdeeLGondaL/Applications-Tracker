import { PipelineCard } from "applume";
import { pipeline, pipelineTotal } from "./_fixtures";

export const Summary = () => (
  <div style={{ maxWidth: 720 }}>
    <PipelineCard pipeline={pipeline} total={pipelineTotal} />
  </div>
);
