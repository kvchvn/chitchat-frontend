type Props = {
  allowedLength: number;
  digits: number;
};

export function NormalizedAllowedMessageLength({ allowedLength, digits }: Props) {
  return (
    <p className="font-mono text-xs text-gray-500 dark:text-gray-300">
      {String(allowedLength).length < digits
        ? `${'0'.repeat(digits - String(allowedLength).length)}${allowedLength}`
        : allowedLength}
    </p>
  );
}
