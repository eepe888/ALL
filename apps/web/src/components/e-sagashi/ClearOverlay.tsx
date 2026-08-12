type Props = {
  stageTitle: string;
  onReset: () => void;
};

export default function ClearOverlay({ stageTitle, onReset }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="pop-in flex w-full max-w-xs flex-col items-center gap-3 rounded-2xl bg-white p-6 text-center shadow-xl dark:bg-zinc-900">
        <span className="text-4xl" aria-hidden>
          🎉
        </span>
        <p className="text-base font-bold">クリア！</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          「{stageTitle}」に隠れていた動物を全部見つけました。
        </p>
        <div className="mt-1 flex w-full flex-col gap-2">
          <button
            type="button"
            onClick={onReset}
            className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-zinc-900"
          >
            もういちどあそぶ
          </button>
          <button
            type="button"
            disabled
            className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-400 dark:border-zinc-800 dark:text-zinc-600"
          >
            つぎのステージ（近日公開）
          </button>
        </div>
      </div>
    </div>
  );
}
