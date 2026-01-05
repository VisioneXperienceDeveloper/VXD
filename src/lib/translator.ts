export async function translateText(text: string, targetLocale: string): Promise<string> {
  if (targetLocale === 'ko') return text;
  // Mock translation: return original text for now
  return text;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function translateBlock(block: any, targetLocale: string): Promise<any> {
  if (targetLocale === 'ko') return block;
  
  const newBlock = JSON.parse(JSON.stringify(block));
  
  // Simple translation for paragraph blocks
  if (newBlock.type === 'paragraph' && newBlock.paragraph.rich_text.length > 0) {
    for (const text of newBlock.paragraph.rich_text) {
      if (text.plain_text) {
        text.plain_text = await translateText(text.plain_text, targetLocale);
        if (text.text) {
            text.text.content = text.plain_text;
        }
      }
    }
  }
  
  // Add more block types as needed (heading_1, heading_2, etc.)
  if (newBlock.type.startsWith('heading_') && newBlock[newBlock.type].rich_text.length > 0) {
      for (const text of newBlock[newBlock.type].rich_text) {
          if (text.plain_text) {
              text.plain_text = await translateText(text.plain_text, targetLocale);
              if (text.text) {
                  text.text.content = text.plain_text;
              }
          }
      }
  }

  return newBlock;
}
