import pathlib
p = pathlib.Path(r"D:\czar III\TRABALHO . CLIENTES\Fernand aprisco\Fernando-Quincas\src\data\blog.ts")
t = p.read_text(encoding='utf-8')
idx = t.find("Troncos que viram brincadeira")
print(repr(t[idx-600:idx+1200]))
