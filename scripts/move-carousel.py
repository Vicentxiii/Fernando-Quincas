import pathlib, re

path = pathlib.Path(r"D:\czar III\TRABALHO . CLIENTES\Fernand aprisco\Fernando-Quincas\src\data\blog.ts")
text = path.read_text(encoding="utf-8")

# Find the post id
# Locate the gallery section: heading + paragraph + carousel
# We want to move it to near top, after the image of fernando-quincas-trabalhando

# Define patterns
heading_galeria = "{ type: 'heading', text: 'Galeria: 30 dias em imagens"
# Find the block: heading + paragraph + carousel as a chunk
# Carousel block is from "{ type: 'carousel', images: [" to "        ],\n      }," after its closing

# Use regex to capture the 3 blocks together
pattern = re.compile(
    r"\s*\{\s*type:\s*'heading',\s*text:\s*'Galeria: 30 dias.*?\},\s*\{\s*type:\s*'paragraph',\s*text:\s*'São mais de 30 fotos.*?\},\s*\{\s*type:\s*'carousel',\s*images:\s*\[.*?\],\s*\},",
    re.DOTALL
)

m = pattern.search(text)
if not m:
    print("NOT FOUND gallery chunk")
    exit(1)

chunk = m.group(0)
print("Found chunk length", len(chunk))
# Remove chunk from original position
text_without = text[:m.start()] + text[m.end():]

# Now find insertion point: after the image fernando-quincas-trabalhando-troncos
insert_marker = "caption: 'Troncos que viram brincadeira: construção do Play Terra com a escola Waldorf ao fundo"
idx = text_without.find(insert_marker)
if idx == -1:
    print("insert marker not found")
    exit(1)
# Find end of that image block: next "},"
# The block ends at "},"
# We need to find the closing "}," after marker
# Let's find the position of the next "}," after marker plus following maybe ","
# Simpler: find the image block that contains that caption, go to its closing "},"
# The image block is: { type: 'image', src: '...fernando-quincas-trabalhando...', alt: ..., caption: 'Troncos...' },
# We can find the next "}," after idx + len(marker)
post_marker = text_without[idx:]
# Find "}," that ends the block: it should be after caption line, maybe "        },"
# Use regex to find the block end
# Find the substring starting at the nearest "{ type: 'image'" before idx
start_img = text_without.rfind("{ type: 'image'", 0, idx)
# Find the closing "}," for that image block (6 spaces indent)
end_img = text_without.find("      },", idx)
if end_img == -1:
    print("end_img not found 6 spaces, trying 8")
    end_img = text_without.find("        },", idx)
if end_img == -1:
    print("end_img not found")
    # debug print
    import pathlib as _pl
    _p = pathlib.Path(r"D:\czar III\TRABALHO . CLIENTES\Fernand aprisco\Fernando-Quincas\src\data\blog.ts")
    _t = _p.read_text(encoding="utf-8")
    _idx = _t.find("Troncos que viram brincadeira")
    print(repr(_t[_idx-200:_idx+800]))
    exit(1)
insert_pos = end_img + len("      },")

# Insert chunk with proper indentation and newline
# Ensure chunk is inserted with leading newline
new_chunk = "\n" + chunk.strip() + "\n"
text_new = text_without[:insert_pos] + new_chunk + text_without[insert_pos:]

# Also need to handle that there is now duplicate heading? No we removed old, so fine

# Write back
path.write_text(text_new, encoding="utf-8")
print("Moved gallery to top, inserted at", insert_pos)
print("Done")
