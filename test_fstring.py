# 测试 f-string 解析

config = {'startSite': '07/1/2024'}

# 测试第114-115行的代码
test_code = f"""if("{config.get('startSite', '')}"!=""){{
    var startSite=new Date("{config.get('startSite', '')}");
    var diff=now.getTime()-startSite.getTime();
}}"""

print("生成的代码:")
print(test_code)
print()

# 测试第220行的代码
test_code2 = f"""var IconList={{'sun': 'M8 10.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z'}};"""
print("生成的代码2:")
print(test_code2)
