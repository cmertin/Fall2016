from __future__ import print_function, division
import numpy as np

def Mesh(f, x0, h_):
    vals = []
    for h in h_:
        h1 = h
        h0 = 1/2 * h
        xp1 = x0 + h1
        xn1 = x0 - h0
        dder = (2/(h0 + h1))*(((f(xp1) - f(x0))/h1) - (f(x0) - f(xn1))/h0)
        temp = abs(np.exp(x0) - dder)
        vals.append(temp)
    return vals

def Newton(f, x0, h_):
    vals = []
    for h in h_:
        h1 = h
        h0 = 1/2 * h
        xp1 = x0 + h1
        xn1 = x0 - h0
        dder = 2 * (((f(xp1) - f(x0))/((xp1 - xn1)*(xp1 - x0))) - ((f(x0) - f(xn1))/((x0 - xn1) * (xp1 - xn1))))
        temp = abs(np.exp(x0) - dder)
        vals.append(temp)
    return vals

def fn(x):
    return np.exp(x)

h_ = [0.1, 0.01, 0.001, 0.0001, 0.00001]
x0 = 0

newton_lst = Newton(fn, x0, h_)
mesh_lst = Mesh(fn, x0, h_)

print("\\begin{table}[H]")
print("\\centering")
print("\\begin{tabular}{l c r}")
print("\\hline\\hline")
print("$h$ & $e_{n}$ & $e_{m}$\\\\")
print("\\hline")
for i in range(0, len(h_)):
    t1 = str(h_[i])
    t2 = "%.4e" % newton_lst[i]
    t3 = "%.4e" % mesh_lst[i]
    print(t1, " & ", t2, " & ", t3, "\\\\")
print("\\hline")
print("\\end{tabular}")
print("\\caption{See {\\tt prob3.py}}")
print("\\end{table}")
