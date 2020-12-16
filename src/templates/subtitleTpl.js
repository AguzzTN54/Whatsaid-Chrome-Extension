export const createSubtitleTpl = (content) => `<!DOCTYPE html>
<html lang="en">
<head>
  <title>Transcribe</title>
  <style>
    body {
      max-height: 49px;
      overflow: hidden;
      display: flex;
      margin:0;
      font-size:larger;
      line-height: 1.5rem;
      pointer-events: none;
    }
    .text {
      background-color: rgba(0,0,0,0.5);
      display: inline-block;
    }
    span {
      margin: 0px 10px;
      height: 100%;
      display: flex;
      align-items:flex-end;
      overflow:hidden;
      color: #fff
    }
  </style>
</head>
<body>
  <div class="text">
    <span>
      ${content}
    </span>
  </div>
</body>
</html>`