def is_valid(board, row, col):
    for i in range(row):
        if board[i][col] == 1:
            return False
        if col-row+i >= 0 and board[i][col-row+i] == 1:
            return False
        if col+row-i < len(board) and board[i][col+row-i] == 1:
            return False
    return True

def dfs(board, row):
    if row == len(board):
        return True
    for col in range(len(board)):
        if is_valid(board, row, col):
            board[row][col] = 1
            if dfs(board, row+1):
                return True
            board[row][col] = 0
    return False

def solve_n_queens():
    #creates the matrices rows and columns
    board = [[0 for j in range(4)] for i in range(4)]
    if dfs(board, 0):
        for row in board:
            print(row)
    else:
        print("No solution exists")

solve_n_queens()