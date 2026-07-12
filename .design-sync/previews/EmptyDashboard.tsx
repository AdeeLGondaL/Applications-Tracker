import { EmptyDashboard } from "applume";
import { noop } from "./_fixtures";

export const FirstRun = () => <EmptyDashboard onAdd={noop} onImport={noop} />;
