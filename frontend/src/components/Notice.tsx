type NoticeProps = {
  text: string,
}

export default function Notice({ text }: NoticeProps) {
  return (
    <div className='notice'>
      <h2>Notice</h2>
      <span>{text}</span>
    </div>
  );
}
