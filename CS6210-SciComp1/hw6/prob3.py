from __future__ import print_function, division
import numpy as np

def stag(f, x0, h):
    h0 = h/2
    h1 = h
    hmid = (h0 + h1)/2
    xneg = x0 - h0
    xplus = x0 + h1
    ghalf = (f(xplus) - f(x0))/h1
    gnhalf = (f(x0) - f(xneg))/h0
    return (ghalf - gnhalf)/hmid

def newton(f, xneg, x0, xplus):
    f01 = (f(xplus) - f(x0))/(xplus - x0)
    fn0 = (f(x0) - f(xneg))/(x0 - xneg)
    return 2 * (f01 - fn0)/(xplus - xneg)

def fn(x):
    return np.exp(x)

x0 = 0

stag_lst = []
newt_lst = []

for i in range(1, 6):
    h = 10**(-i)
    temp = stag(fn, x0, h)
    stag_lst.append([h, temp])
    temp = newton(fn, x0-h, x0, x0+h)
    newt_lst.append([h, temp])

print(stag_lst)
print(newt_lst)
