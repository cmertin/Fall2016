from __future__ import print_function, division
import numpy as np

def f_pi(x):
    return (4/(1 + x**2))

def Romberg(a, b, fn, n=100, tol=10**(-7)):
    h = (b - a)
    idx = 1
    R = np.zeros((n,n), dtype=np.float64)
    print("\t Iteration: " + str(idx))
    R[idx, idx] = h/2 * (fn(a) + fn(b))
    old = R[idx, idx] + 10
    fn_evals = 2
    while abs(R[idx, idx-1] - R[idx, idx]) > tol:
        old = R[idx, idx]
        idx = idx + 1
        print("\t Iteration: " + str(idx))
        if idx >= R.shape[0]-1:
            print("Did Not Converge")
            return R, idx
        temp_s = 0
        for k in range(1, 2**(idx-2)+1):
            fn_evals = fn_evals + 1
            temp_s = temp_s + fn(a + (k - 0.5)*h)
        R[idx, 1] = 1/2 * (R[idx-1, 1] + h * temp_s)
        for j in range(2, idx+1):
            R[idx, j] = R[idx,j-1] + (R[idx, j-1] - R[idx-1, j-1])/(4**(j-1) - 1)
        h = h/2
    print("Function Evaluations: " + str(fn_evals))
    return R, idx

R_table, itr = Romberg(0, 1, f_pi)

# Deletes the first row of the Romberg Table
R_table = np.delete(R_table, (0), axis=0)
print('\n')
# Prints out the Romberg Table as a LaTeX table
print("\\begin{table}[H]")
print("\\centering")
print("\\begin{tabular}{", end="")
for i in range(0, itr):
    print("c ", end="")
print("}")
print("\\hline\\hline")

for i in range(0, itr):
    for j in range(1, itr+1):
        if R_table[i, j] != 0:
            temp = "%.8f" % R_table[i,j]
            print(temp, end="")
        if(j != itr):
            print(" & ", end="")
    print("\\\\")
print("\\hline")
print("\\end{tabular}")
print("\\caption{Romberg Table, see {\\tt prob9.py}}")
print("\\end{table}")
