from __future__ import print_function, division
import numpy as np
from scipy.optimize import newton

# Uses the secant method if no f^prime is provided
# https://docs.scipy.org/doc/scipy-0.18.1/reference/generated/scipy.optimize.newton.html#scipy.optimize.newton
def fn(f, x0):
    return newton(f, x0)



'''
function x = secant(func, x0, x1, tol)
k = 3;
err = abs(x1-x0);
x(1) = x1;
x(2) = x(1) - (feval(func,x1) * (x1 - x0))/(feval(func,x1) - feval(func,x0));
while (err >= tol)
    x(k) = x(k-1) - (feval(func,x(k-1)) * (x(k-1) - x(k-2)))/(feval(func,x(k-1)) - feval(func,x(k-2)));
    err = abs(x(k)-x(k-1));
    k = k+1;
end
'''
