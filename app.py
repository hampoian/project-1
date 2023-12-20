from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
db = SQLAlchemy(app)


class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    comments = db.relationship('Comment', backref='task', lazy=True)

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text)
    task_id = db.Column(db.Integer, db.ForeignKey('task.id'), nullable=False)

@app.route('/')
def index():
    tasks = Task.query.all()
    return render_template('index.html', tasks=tasks)

@app.route('/task/<int:task_id>', methods=['GET', 'POST'])
def task(task_id):
    task = Task.query.get(task_id)

    if request.method == 'POST':
        comment_text = request.form['comment']
        new_comment = Comment(text=comment_text, task_id=task_id)
        db.session.add(new_comment)
        db.session.commit()

    return render_template('task.html', task=task)

@app.route('/add_task', methods=['GET', 'POST'])
def add_task():
    if request.method == 'POST':
        title = request.form['title']
        description = request.form['description']
        new_task = Task(title=title, description=description)
        db.session.add(new_task)
        db.session.commit()
        return redirect(url_for('index'))

    return render_template('add_task.html')

from sqlalchemy import or_

@app.route('/search_task', methods=['GET', 'POST'])
def search_task():
    if request.method == 'POST':
        search_term = request.form.get('search_term', '')
        tasks = Task.query.filter(or_(Task.title.ilike(f'%{search_term}%'), Task.id == int(search_term))).all()
    else:
        tasks = []

    return render_template('search_task.html', tasks=tasks)


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
