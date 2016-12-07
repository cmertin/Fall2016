from __future__ import print_function, division
import numpy as np

def f(x):
    return np.sin(x)

x0 = 1.2
i = np.arange(0, 8.4, 0.5)
j = 1
fpp0 = []

for i_ in i:
    h = 10**(-i_)
    ghalf = (f(x0 + h) - f(x0))/h
    gnhalf = (f(x0) - f(x0 - h))/h
    temp = (ghalf - gnhalf)/h
    fpp0.append([i_, temp])
    j = j + 1

print("\\begin{table}[H]")
print("\centering")
print("\\begin{tabular}{l r}")
print("\\hline \\hline")
print("$h$ & $f_{pp_{0}}$\\\\")
print("\\hline")
for fp in fpp0:
    temp = "$10^{" + str(-fp[0]) + "}$"
    temp2 = "%.5f" % fp[1]
    print(temp, " & ", temp2, "\\\\")
print("\\hline")
print("\\end{tabular}")
print("\\caption{See {\\tt prob4.py}}")
print("\\end{table}")
